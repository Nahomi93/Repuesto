import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import dayjs from 'dayjs'
import { useReparaciones } from "../context/ReparacionContext";
import { useEffect } from "react";
import { useTecnicos } from "../context/TecnicoContext";
import { Label } from "../components/ui";


export function MyCalendar() {
    const { tecnicos, getTecnicos } = useTecnicos();

    const { reparaciones, getReparaciones } = useReparaciones();
    useEffect(() => {
        getReparaciones();
        getTecnicos();

    }, []);

    // Función para convertir fecha de string ISO a objeto Date
    const isoStringToDate = (isoString) => {
        const date = new Date(isoString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Mapear los datos recibidos a una lista de eventos para el calendario
    const myEventsList = reparaciones.map(item => ({
        title: item.tecnico.username,
        start: isoStringToDate(item.fecha_recepcion),
        end: isoStringToDate(item.fecha_recepcion),
        //end: isoStringToDate(item.fecha_devolucion),
    }));
    console.log(myEventsList.start)
    const localizer = dayjsLocalizer(dayjs)

    // las fechas se las utiliza un dia antes para el mes, por ejemplo 0 es enero y 11 es diciembre
    /*const myEventsList = [
        {
            title: 'Meeting',
            start: new Date(2024, 0, 28), // 4 de agosto de 2023 a las 00:00:00
            end: new Date(2024, 8, 3), // 4 de agosto de 2023 a las 00:00:00
        },
        {
            title: 'Conference',
            start: new Date(2024, 8, 1), // 4 de agosto de 2023 a las 00:00:00
            end: new Date(2024, 8, 4), // 4 de agosto de 2023 a las 00:00:00
        },
    ];
    */
    return (

        <div style={{
            height: "70vh",
            width: "60vw"
        }}>
            <h1 className="text-2xl font-bold">Fechas Reservadas</h1>
            <Label htmlFor="title">Actualmente tenemos {tecnicos.length} técnico(s)</Label>
            {tecnicos.map(tecnico => (
                <div key={tecnico._id}>
                    <Label htmlFor="title">El técnico se llama {tecnico.username}</Label>
                </div>
            ))}
            <p className="text-slate-300"></p>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
            //style={{ height: 500 }}
            />
        </div>
    );
}
