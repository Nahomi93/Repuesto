import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import logoBase64 from '../imagenes/logoInfo.png';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

export const reporteCalificacion = (reparaciones, username) => {
  // Mostrar cuadro de selección de mes y año
  Swal.fire({
    title: 'Seleccionar Mes y Año',
    html: `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <select id="mes" class="swal2-input">
          ${[...Array(12).keys()].map(
            (i) => `<option value="${i}">${new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>`
          )}
        </select>
        <input type="number" id="anio" class="swal2-input" placeholder="Año" min="1900" max="2100" />
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const mes = document.getElementById('mes').value;
      const anio = document.getElementById('anio').value;

      if (!mes || !anio) {
        Swal.showValidationMessage('Por favor, selecciona un mes y un año.');
        return false;
      }

      return { mes: parseInt(mes), anio: parseInt(anio) };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { mes, anio } = result.value;

      // Filtrar reparaciones por mes y año seleccionados
      const reparacionesFiltradas = reparaciones.filter((r) => {
        const fecha = new Date(r.updatedAt);
        return fecha.getMonth() === mes && fecha.getFullYear() === anio;
      });

      // Generar el PDF con las reparaciones filtradas
      generarPDF(reparacionesFiltradas, mes, anio, username);
    }
  });
};

const generarPDF = (reparaciones, mes, anio, username) => {
  const doc = new jsPDF({ format: 'letter' });

  const opciones = {
    titulo: `Reporte de Calificaciones - ${new Date(anio, mes).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}`,
    nombreArchivo: `Reporte_Calificaciones_${mes + 1}_${anio}.pdf`,
    logo: logoBase64,
    firma: `Técnico: ${username}`,
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

  const tablaEncabezado = [['Cliente', 'Descripción', 'Calificación']];
  const tablaDatos = reparaciones.map((r) => [
    r.cliente.username,
    r.description_problema,
    r.calificacion
      ? `${r.calificacion} estrella${r.calificacion > 1 ? 's' : ''}`
      : { content: 'Sin calificar', styles: { textColor: 'red' } },
  ]);

  const autoTableOptions = {
    startY: 60,
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
  };

  doc.autoTable(autoTableOptions);

  const finalY = doc.lastAutoTable.finalY || 25;
  const firmaX = pageWidth / 2;
  doc.line(firmaX - 30, finalY + 20, firmaX + 30, finalY + 20);
  doc.setFontSize(12);
  doc.text(opciones.firma, firmaX, finalY + 30, { align: 'center' });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(opciones.nombreArchivo);
};
