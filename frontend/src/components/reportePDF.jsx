import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import logoBase64 from '../imagenes/logoInfo.png';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

export const reportePDF = (reparaciones, usuario) => {
  // Mostrar cuadro de diálogo para filtrar fechas
  Swal.fire({
    title: 'Filtrar por fechas',
    html: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label for="inicioReserva" style="margin-right: 10px;">Fecha inicio reserva:</label>
          <input type="date" id="inicioReserva" class="swal2-input" style="width: 60%;" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label for="finReserva" style="margin-right: 10px;">Fecha fin reserva:</label>
          <input type="date" id="finReserva" class="swal2-input" style="width: 60%;" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label for="inicioDevolucion" style="margin-right: 10px;">Fecha inicio devolución:</label>
          <input type="date" id="inicioDevolucion" class="swal2-input" style="width: 60%;" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label for="finDevolucion" style="margin-right: 10px;">Fecha fin devolución:</label>
          <input type="date" id="finDevolucion" class="swal2-input" style="width: 60%;" />
        </div>
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const inicioReserva = document.getElementById('inicioReserva').value;
      const finReserva = document.getElementById('finReserva').value;
      const inicioDevolucion = document.getElementById('inicioDevolucion').value;
      const finDevolucion = document.getElementById('finDevolucion').value;
      return { inicioReserva, finReserva, inicioDevolucion, finDevolucion };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { inicioReserva, finReserva, inicioDevolucion, finDevolucion } = result.value;

      // Filtrar reparaciones por las fechas seleccionadas
      const reparacionesFiltradas = reparaciones.filter((r) => {
        const fechaReserva = new Date(r.fecha_recepcion);
        const fechaDevolucion = new Date(r.fecha_devolucion);

        let matchfechaReserva = true;  // Por defecto es `true` para incluir todas si no hay filtros
        let matchfechaDevolucion = true;

        // Validación para fechas de reserva
        if (inicioReserva || finReserva) {
          if (inicioReserva && finReserva) {
            matchfechaReserva = 
              fechaReserva >= new Date(inicioReserva) && fechaReserva <= new Date(finReserva);
          } else {
            // Mostrar mensaje si solo se proporciona una fecha
            Swal.showValidationMessage('Ambas fechas de reserva son obligatorias para filtrar.');
            return false;
          }
        }

        // Validación para fechas de devolución
        if (inicioDevolucion || finDevolucion) {
          if (inicioDevolucion && finDevolucion) {
            matchfechaDevolucion = 
              fechaDevolucion >= new Date(inicioDevolucion) && fechaDevolucion <= new Date(finDevolucion);
          } else {
            // Mostrar mensaje si solo se proporciona una fecha
            Swal.showValidationMessage('Ambas fechas de devolución son obligatorias para filtrar.');
            return false;
          }
        }

        // Incluir la reparación si cumple con ambos filtros o si no se aplican filtros
        return matchfechaReserva && matchfechaDevolucion;
      });

      // Generar el PDF con las reparaciones filtradas (o todas si no se aplicaron filtros)
      generarPDF(reparacionesFiltradas, usuario);

    }
  });
};

const generarPDF = (reparaciones, usuario) => {
  const doc = new jsPDF({ format: 'letter' });

  const opciones = {
    titulo: 'Reporte de reparaciones',
    nombreArchivo: `Reporte de Reparaciones.pdf`,
    logo: logoBase64,
    firma: `Técnico: ${usuario}`,
    fechaImpresion: formatDateTime(new Date()),
    tamanoFuente: 12,
  };

  function formatDateTime(date) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
    const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
    return `${formattedDate} ${formattedTime}`;
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;

  const addHeader = () => {
    doc.addImage(opciones.logo, 'PNG', 5, 5, 50, 25);
    doc.setFontSize(10);
    doc.text(`FECHA DE IMPRESIÓN: ${opciones.fechaImpresion}`, pageWidth - margin, 20, { align: 'right' });
  };

  addHeader();
  doc.setFontSize(20);
  doc.text(opciones.titulo, pageWidth / 2, 40, { align: 'center' });

  const tablaEncabezado = [['Cliente', 'Descripción', 'Técnico', 'Diagnóstico', 'Estado', 'Fecha devolución', 'Fecha recepción']];
  const tablaDatos = reparaciones.map((r) => [
    r.cliente.username,
    r.description_problema,
    r.tecnico.username,
    r.problemaDiagnosticado ? r.problemaDiagnosticado : 'sin problema',
    r.estado,
    format(new Date(r.fecha_devolucion), 'dd/MM/yyyy'),
    format(new Date(r.fecha_recepcion), 'dd/MM/yyyy'),
  ]);

  doc.autoTable({
    startY: 50,
    margin: { horizontal: margin },
    theme: 'grid',
    head: tablaEncabezado,
    body: tablaDatos,
    styles: {
      font: 'helvetica',
      fontSize: 12,
      halign: 'center',
    },
    headStyles: {
      fillColor: '#cccccc',
      fontStyle: 'bold',
    },
  });

  const finalY = doc.lastAutoTable.finalY || 25;
  const firmaX = pageWidth / 2;
  doc.line(firmaX - 30, finalY + 20, firmaX + 30, finalY + 20);
  doc.text(opciones.firma, firmaX, finalY + 30, { align: 'center' });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(opciones.nombreArchivo);
};
