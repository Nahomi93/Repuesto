import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useReparaciones } from "../context/ReparacionContext";
import { Textarea } from "../components/ui/Textarea";
import { get, useForm } from "react-hook-form";
import "../styles/styles.css";
dayjs.extend(utc);
import { useClientes } from "../context/ClienteContext";
import { useTecnicos } from "../context/TecnicoContext";
import { useTasks } from "../context/TaskContext";
import { getTasksPorClienteRequest } from "../api/tasks";
import { useAuth } from "../context/AuthContext";

export function ReparacionFormPage() {
  const { createReparacion, getReparacion, updateReparacion, deleteReparacionFoto } = useReparaciones();
  const { clientes, getClientes } = useClientes();
  const { tecnicos, getTecnicos } = useTecnicos();
  const { tasks, getTasksPorCliente, getTasks } = useTasks();
  const [reserva, setReserva] = useState([]);
  const { user } = useAuth();

  const [clienteId, setClienteId] = useState(''); // Estado para el cliente seleccionado
  const [taskId, setTaskId] = useState(''); // Estado para la tarea seleccionada
  const [fechaReserva, setFechaReserva] = useState(''); // Estado para la fecha de reserva
  const [descripcionProblema, setDescripcionProblema] = useState('');

  const [accesorios, setAccesorios] = useState([{ id: Math.random(), value: "" }]);
  const [cotizaciones, setCotizaciones] = useState([{ id: Math.random(), componente: "", precio: "", aceptado: false }]);

  const [garantia, setGarantia] = useState(false); // Estado para la garantía
  const [problemaDiagnosticado, setProblemaDiagnosticado] = useState('');

  const [idtask, setIdTask] = useState('');

  const [fotos, setFotos] = useState([]);
  const [existingFotos, setExistingFotos] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const { register, setValue, handleSubmit, formState: { errors }, } = useForm();

  useEffect(() => {
    getClientes(); // Cargar clientes al montar el componente
    getTecnicos(); // Cargar técnicos al montar el componente
    getTasks();
  }, []);

  const handleClienteChange = (e) => {
    const selectedId = e.target.value; // Actualizar cliente seleccionado
    const reservas = tasks.filter(task => task.cliente._id === selectedId);
    setReserva(reservas);
    setFechaReserva(''); // Resetear la fecha al cambiar de cliente
    setTaskId('')
    setDescripcionProblema(''); // Resetear la descripción al cambiar de cliente
    setClienteId(selectedId);
  };


  const handleTaskChange = (e) => {
    const selectedTaskId = e.target.value;
    const selectedTask = tasks.find(task => task._id === selectedTaskId);
    if (selectedTask) {
      setTaskId(selectedTaskId);
      setFechaReserva(new Date(selectedTask.date).toISOString().split('T')[0]); // Asignar fecha de reserva
      setDescripcionProblema(selectedTask.description); // Asignar descripción
    } else {
      setFechaReserva(''); // Resetear si no se selecciona una tarea válida
      setDescripcionProblema('');
    }
  };

  const onSubmit = async (data) => {
    try {
      const accesoriosDejados = accesorios.map(accesorio => accesorio.value.trim()).filter(value => value !== "");
      // Al enviar las cotizaciones, asegúrate de usar el siguiente formato
      const cotizacionesToSend = cotizaciones.map(cotizacion => ({
        componente: cotizacion.componente || "",  // Incluye el componente, con un valor por defecto si no existe
        precio: parseFloat(cotizacion.precio) || 0,  // Convierte a número y usa 0 si no se puede convertir
        aceptado: cotizacion.aceptado !== undefined ? cotizacion.aceptado : false // Aceptado es false por defecto
      }));

      const formData = new FormData();

      fotos.forEach(file => {
        formData.append('fotos', file);
      });
      console.log(data);
      existingFotos.forEach(foto => {
        formData.append('existingFotos', foto); // Esto es para mantener fotos ya existentes
      })
      // Añadir datos del formulario manualmente
      formData.append('cliente', clienteId);
      formData.append('tecnico', data.tecnico);
      formData.append('description_problema', descripcionProblema);
      formData.append('garantia', data.garantia);
      formData.append('problemaDiagnosticado',data.problemaDiagnosticado);
      formData.append('costo', data.costo);
      formData.append('aceptacion_cambios', data.aceptacion_cambios);
      formData.append('fecha_recepcion', dayjs.utc(fechaReserva).format());
      formData.append('fecha_devolucion', dayjs.utc(data.fecha_devolucion).format());
      formData.append('accesorios_dejados', JSON.stringify(accesoriosDejados)); // Asegúrate de que el servidor pueda parsear JSON
      // Añadir cotizaciones a formData
      formData.append('cotizacion', JSON.stringify(cotizacionesToSend));

      console.log(data);
      // Para ver lo que contiene FormData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      if (params.id) {
        updateReparacion(params.id, formData);
      } else {
        createReparacion(formData);
      }

      navigate("/reparaciones");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function loadTask() {
      const accesoriosDejados = accesorios.map(accesorio => accesorio.value.trim()).filter(value => value !== "");

      if (params.id) {
        const reparacion = await getReparacion(params.id);
        setIdTask(params.id)
        console.log(reparacion)
        //        const t = clientes.filter(cliente => cliente._id === reparacion.cliente);

        setValue("garantia", reparacion.garantia);
        setValue("fecha_devolucion", reparacion.fecha_devolucion ? dayjs(reparacion.fecha_devolucion).utc().format("YYYY-MM-DD") : "");
        setAccesorios(reparacion.accesorios_dejados.map((accesorio, index) => ({ id: index, value: accesorio })));
        setValue("costo", reparacion.costo);
        setClienteId(reparacion.cliente);  // Actualizar el estado de clienteId
        setValue("tecnico", reparacion.tecnico);
        setValue("aceptacion_cambios", reparacion.aceptacion_cambios);
        setGarantia(reparacion.garantia);
        setProblemaDiagnosticado(reparacion.problemaDiagnosticado);

        setDescripcionProblema(reparacion.description_problema); // Asignar descripción
        setFechaReserva(reparacion.fecha_recepcion ? dayjs(reparacion.fecha_recepcion).utc().format("YYYY-MM-DD") : ""); // Resetear si no se selecciona una tarea válida
        setExistingFotos(reparacion.fotos);
        setCotizaciones(
          reparacion.cotizacion.map((item, index) => ({
            id: index, // Puedes usar index o un ID único si está disponible
            componente: item.componente || "", // Asegúrate de que haya un valor predeterminado
            precio: item.precio || "", // Asegúrate de que haya un valor predeterminado
            aceptado: item.aceptado || false, // Asegúrate de que haya un valor predeterminado
          }))
        );
      }
    };
    loadTask();
    getClientes();
    getTecnicos();
  }, []);

  const handleAccesorioChange = (id, event) => {
    const newAccesorios = accesorios.map(accesorio => {
      if (accesorio.id === id) {
        return { ...accesorio, value: event.target.value };
      }
      return accesorio;
    });
    setAccesorios(newAccesorios);
  };

  const addAccesorio = (e) => {
    e.preventDefault(); // Esto previene la propagación de eventos
    setAccesorios(accesorios.concat({ id: Math.random(), value: "" }));
  };

  const removeAccesorio = (e, id) => {
    e.preventDefault(); // Esto previene la propagación de eventos
    setAccesorios(accesorios.filter(accesorio => accesorio.id !== id));
  };

  const handleFileChange = (event) => {
    event.preventDefault(); // Esto previene la propagación de eventos
    // Agregar nuevos archivos a los ya existentes
    setFotos([...fotos, ...Array.from(event.target.files)]);
  };

  const removeFoto = (e, index) => {
    e.preventDefault(); // Esto previene la propagación de eventos
    setFotos(fotos.filter((_, idx) => idx !== index));
  };

  const handleRemoveExistingFoto = async (e, index) => {
    e.preventDefault();
    const foto = existingFotos[index];
    try {
      await deleteReparacionFoto(params.id, foto);
      setExistingFotos(existingFotos.filter((_, idx) => idx !== index));
    } catch (error) {
      console.error('Error al eliminar la foto', error);
    }
  };


  const handleCotizacionChange = (id, event) => {
    const newCotizaciones = cotizaciones.map(cotizacion => {
      if (cotizacion.id === id) {
        return { ...cotizacion, precio: event.target.value }; // Actualiza el precio
      }
      return cotizacion;
    });
    setCotizaciones(newCotizaciones);
  };

  const handleComponenteChange = (id, event) => {
    const newCotizaciones = cotizaciones.map(cotizacion => {
      if (cotizacion.id === id) {
        return { ...cotizacion, componente: event.target.value }; // Actualiza el componente
      }
      return cotizacion;
    });
    setCotizaciones(newCotizaciones);
  };

  const handleAceptadoChange = (id, isChecked) => {
    const newCotizaciones = cotizaciones.map(cotizacion => {
      if (cotizacion.id === id) {
        return { ...cotizacion, aceptado: isChecked }; // Actualiza el estado aceptado
      }
      return cotizacion; // Devuelve la cotización sin cambios
    });
    setCotizaciones(newCotizaciones); // Actualiza el estado de cotizaciones
  };

  const addCotizacion = (e) => {
    e.preventDefault(); // Esto previene la propagación de eventos
    setCotizaciones(cotizaciones.concat({ id: Math.random(), componente: "", precio: "", aceptado: false })); // Aceptado por defecto en false
  };

  const removeCotizacion = (e, id) => {
    e.preventDefault(); // Esto previene la propagación de eventos
    setCotizaciones(cotizaciones.filter(cotizacion => cotizacion.id !== id));
  };


  return (
    <Card>
      <h1 className="text-2xl font-bold text-center mb-6 relative custom-title">
        Registro de Reparación</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        {user.rol === 'Administrador' && (
          <>
            <div>
              <Label htmlFor="cliente">Ingrese al cliente:</Label>
              <select
                name="cliente"
                style={{ color: 'black' }}
                value={clienteId}
                onChange={handleClienteChange}
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente._id}>
                    {cliente.username}
                  </option>
                ))}
              </select>
            </div>
            {!idtask && ( // Solo renderiza el div si id no está presente

              <div>
                <Label htmlFor="task">Seleccione una tarea:</Label>
                <select
                  name="task"
                  style={{ color: 'black' }}
                  value={taskId}
                  onChange={handleTaskChange}
                >
                  <option value="">Seleccione una tarea</option>
                  {reserva.map(task => (
                    <option key={task.id} value={task._id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="tecnico">Ingrese al técnico:</Label>
              <select
                name="tecnico"
                style={{ color: 'black' }}
                {...register("tecnico")}
              >
                <option value="">Seleccione un técnico</option>
                {tecnicos.map(tecnico => (
                  <option key={tecnico.id} value={tecnico._id}>
                    {tecnico.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="accesorio">Accesorios dejados:</Label>
              {accesorios.map((accesorio, index) => (
                <div key={accesorio.id}>
                  <Input
                    type="text"
                    value={accesorio.value}
                    onChange={e => handleAccesorioChange(accesorio.id, e)}
                    placeholder="Ingrese un accesorio dejado"
                  />
                  {accesorios.length > 1 && (
                    <Button type="button" onClick={(e) => removeAccesorio(e, accesorio.id)}>Eliminar</Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={addAccesorio}>Agregar Accesorio</Button>
            </div>

            <div>
              <Label htmlFor="description_problema">Descripción del problema:</Label>
              <Textarea
                value={descripcionProblema} readOnly
              ></Textarea>
            </div>

            <div>
              <Label htmlFor="garantia">Garantía:</Label>
              <Input
             type="checkbox"
             name="garantia"
             {...register("garantia")}
/>
            </div>

            <div>
              <Label htmlFor="costo">Costo:</Label>
              <Input
                type="number"
                name="costo"
                {...register("costo")}
              />
            </div>

            <div>
              <Label htmlFor="problemaDiagnosticado">Problema Diagnosticado:</Label>
             <Textarea
              name="problemaDiagnosticado"
               {...register("problemaDiagnosticado")}
             />
            </div>

            <div>
              <Label htmlFor="aceptacion_cambios">Aceptación cambios:</Label>
              <Input
                type="checkbox"
                name="aceptacion_cambios"
                {...register("aceptacion_cambios")}
              />
            </div>

            <div>
              <Label htmlFor="fecha_recepcion">Fecha de Reserva:</Label>
              <Input type="date" value={fechaReserva} readOnly />
            </div>

            <div>
              <Label htmlFor="fecha_devolucion">Fecha de Devolución:</Label>
              <Input
                type="date"
                name="fecha_devolucion"
                {...register("fecha_devolucion")}
                min={dayjs().format("YYYY-MM-DD")}
              />

            </div>
          </>
        )};
        <div>
          <Label htmlFor="cotizacion">Cotización:</Label>
          {cotizaciones.map((cotizacion, index) => (
            <div key={cotizacion.id}>
              <Label htmlFor="cotizacion">componente:</Label>

              <Input
                type="text" // Cambia a "text" para aceptar el componente como texto
                value={cotizacion.componente}
                onChange={e => handleComponenteChange(cotizacion.id, e)}
                placeholder="Ingrese el componente"
                disabled={user.rol === 'cliente'} // Bloquea el input si el rol es 'cliente'

              />
              <Label htmlFor="cotizacion">precio en bs:</Label>

              <Input
                type="number" // Asegúrate de que solo acepte números
                step="0.01" // Permite decimales para valores de cotización
                value={cotizacion.precio}
                onChange={e => handleCotizacionChange(cotizacion.id, e)}
                placeholder="Ingrese una cotización"
                disabled={user.rol === 'cliente'} // Bloquea el input si el rol es 'cliente'

              />
              {user.rol === 'Cliente' && (
<>
              <Label htmlFor="cotizacion">Aceptar:</Label>
              <Input
                type="checkbox"
                checked={cotizacion.aceptado} // Marca el checkbox si está aceptado
                onChange={e => handleAceptadoChange(cotizacion.id, e.target.checked)} // Envía el estado del checkbox
              />
              </>
              )};
              {cotizaciones.length > 1 && user.rol === 'Administrador' && (
                <Button type="button" onClick={(e) => removeCotizacion(e, cotizacion.id)}>Eliminar</Button>
              )}
            </div>
          ))}
          {user.rol === 'Administrador' && (
            <Button type="button" onClick={addCotizacion}>Agregar cotización</Button>
          )};
        </div>
        {user.rol === 'Administrador' && (
          <div>
            <Label htmlFor="fotos">Fotos:</Label>
            <Input
              type="file"
              name="fotos"
              multiple
              onChange={handleFileChange}
            />
            {fotos.map((file, index) => (
              <div key={index}>
                {file.name}
                <Button type="button" onClick={(e) => removeFoto(e, index)}>Eliminar</Button>
              </div>
            ))}
            {/* Mostrar fotos existentes con opción para eliminar */}
            {existingFotos.map((foto, index) => (
              <div key={index}>
                {foto} {/* Aquí deberías tener una vista previa o un enlace a la foto */}
                <Button type="button" onClick={(e) => handleRemoveExistingFoto(e, index)}>Eliminar</Button>
              </div>
            ))}
          </div>
        )};
        <div className="flex justify-center">
          <Button type="submit">Guardar Reparación</Button>
        </div>
      </form>
    </Card>
  );
}
