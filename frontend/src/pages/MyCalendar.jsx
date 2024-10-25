import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from 'dayjs';
import { useReparaciones } from "../context/ReparacionContext";
import { useEffect } from "react";
import { useTecnicos } from "../context/TecnicoContext";
import { Label } from "../components/ui";

// Configurar la localización con DayJS
const localizer = dayjsLocalizer(dayjs);

export function MyCalendar( fechas, horarios) {
    const { tecnicos, getTecnicos } = useTecnicos();
    const { reparaciones, getReparaciones } = useReparaciones();

    // Obtener técnicos y reparaciones al cargar el componente
    useEffect(() => {
        getReparaciones();
        getTecnicos();
    }, []);

    // Función para convertir una fecha ISO a un objeto Date (con hora)
    const isoStringToDateWithTime = (isoString) => {
        const date = new Date(isoString);
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),  // Hora
            date.getMinutes() // Minutos
        );
    };

    // Mapear reparaciones a eventos para el calendario
    const myEventsList = reparaciones.map(item => ({
        title: `Técnico: ${item.tecnico.username}`,
        start: isoStringToDateWithTime(item.fecha_recepcion),
        end: isoStringToDateWithTime(item.fecha_devolucion || item.fecha_recepcion), // Usa fecha_devolución si está disponible
    }));

    return (
        <div style={{ height: "70vh", width: "60vw" }}>
            <h1 className="text-2xl font-bold">Fechas y Horarios Ocupados</h1>
            
            <Label htmlFor="title">Actualmente tenemos {tecnicos.length} técnico(s)</Label>
            {tecnicos.map(tecnico => (
                <div key={tecnico._id}>
                    <Label htmlFor="title">El técnico se llama {tecnico.username}</Label>
                </div>
            ))}

            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                defaultView="week" // Vista semanal por defecto
                views={['month', 'week', 'day']} // Opciones de vista
                step={60} // Intervalo de tiempo en minutos
                timeslots={1} // Mostrar cada hora como un bloque individual
                style={{ height: 500, marginTop: "20px" }}
            />
        </div>
    );
}
