import { Document, Text, Page, StyleSheet, Image, View } from "@react-pdf/renderer";

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 20,
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  section: {
    marginVertical: 5,
    padding: 10,
    borderBottom: "1px solid #ccc",
  },
  dataContainer: {
    flexDirection: "column",
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#555",
  },
  value: {
    fontSize: 10,
    color: "#000",
  },
});
function formatDateTime(date) {
  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
  const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
  return `${formattedDate} ${formattedTime}`;
}
function Pdf({ reparacion }) {
  // Verificar si los datos están cargados correctamente
  if (!reparacion || !reparacion.cliente) {
    return <Text>Cargando datos...</Text>;
  }
  

  return (
    <Document>
      <Page size={[8.5 * 72, 5.5 * 72]} style={styles.page}>
        {/* Header con logo y título */}
        <View style={styles.header}>
          <Image src="src/imagenes/logoInfo.png" style={styles.logo} />
          <Text style={styles.title}>Registro de Reparación</Text>
        </View>

        {/* Sección con los datos de la reparación */}
        <View style={styles.section}>
          <View style={styles.dataContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>{reparacion.cliente.username || 'N/A'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Técnico:</Text>
              <Text style={styles.value}>{reparacion.tecnico?.nombre || 'N/A'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Fecha de Recepción:</Text>
              <Text style={styles.value}>{formatDateTime(new Date(reparacion.fecha_recepcion)) || 'N/A'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Fecha de Devolución:</Text>
              <Text style={styles.value}>{formatDateTime(new Date(reparacion.fecha_devolucion))|| 'N/A'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Descripción del Problema:</Text>
              <Text style={styles.value}>{reparacion.description_problema || 'N/A'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Costo:</Text>
              <Text style={styles.value}>{reparacion.costo || 0} Bs</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Accesorios Dejados:</Text>
              <Text style={styles.value}>{reparacion.accesorios_dejados?.join(", ") || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default Pdf;
