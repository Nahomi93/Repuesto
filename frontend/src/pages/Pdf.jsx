import { Document, Text, Page, StyleSheet, Image, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    section: {
        backgroundColor: "#7e634e",
        display: "flex",
        flexDirection: "row"
    },
    body:{

    }
});

function Pdf({ reparacion }) {
    console.log("entra al pdf")
    return (
        <Document>
            <Page size="A4" style={{ padding: 20 }}>
                <View style={styles.section}>
                    <Text >Registro de reparacion</Text>
                </View>
                <View style={styles.body}>
                        <View >
                                <Text >{reparacion.cliente.username}</Text>
                                <Text >Tecnico {reparacion.tecnico.nombre}</Text>
                                <Text >Fecha de recepcion: {reparacion.fecha_recepcion}</Text>
                                <Text >Fecha de devolucion: {reparacion.fecha_devolucion}</Text>
                                <Text >Descripcion del problema: {reparacion.description_problema}</Text>
                                <Text >Costo: {reparacion.costo}</Text>
                                <Text>accesorios dejados: {reparacion.accesorios_dejados}</Text>

                        </View>

                </View>
            </Page>
        </Document>
    );
}

export default Pdf;