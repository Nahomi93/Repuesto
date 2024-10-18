import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useTasks } from "../context/TaskContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
import { MyCalendar } from "./MyCalendar";
import Modal from 'react-modal';
import { useAuth } from "../context/AuthContext";
import { useClientes } from "../context/ClienteContext";

dayjs.extend(utc);

export function TaskFormPage() {
  const { createTask, getTask, updateTask } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { clientes, getClientes } = useClientes();
  const { register, setValue, handleSubmit, formState: { errors }, } = useForm();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

const onSubmit = async (data) => {
  try {
    // Formatea la fecha como UTC solo al enviar al backend
    const formattedDate = dayjs(data.date).utc().format(); // Asegúrate de usar solo 'dayjs(data.date)'

    if (params.id) {
      updateTask(params.id, {
        ...data,
        date: formattedDate,
      });
    } else {
      createTask({
        ...data,
        date: formattedDate,
      });
    }
    navigate("/tasks");
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
        setValue("title", task.title);
        setValue("tipo", task.tipo);
        setValue("description", task.description);
        setValue("date", task.date ? dayjs(task.date).utc().format("YYYY-MM-DD") : "");

        setValue("garantia", task.garantia);

        // Solo el cliente puede ver y modificar el estado si se carga en la edición
        if (user.rol === 'Cliente') {
          setValue("completed", task.completed);
        }
      }
      if (user.rol === 'Administrador' || user.rol === 'Tecnico') {
        await getClientes(); // Cargar los clientes si el rol es Admin o Técnico
      }
    }
    loadTask();
  }, []);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold text-center mb-6 relative custom-title">
          Registro de Reserva
        </h1>
        {user.rol === 'Administrador' || user.rol === 'Tecnico' ? (
          <div>
            <Label htmlFor="cliente">Ingrese al cliente:</Label>
            <select
              name="cliente"
              style={{ color: 'black' }}
              {...register("cliente")}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.username}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <Label htmlFor="title">Marca del dispositivo:</Label>
        <Input
          type="text"
          name="title"
          placeholder="Ingrese la marca del equipo"
          {...register("title")}
          autoFocus
        />
        <Label htmlFor="tipo">Tipo del dispositivo:</Label>
        <Input
          type="text"
          name="tipo"
          placeholder="Ingrese el tipo de equipo"
          {...register("tipo")}
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">Ingrese la marca de su equipo</p>
        )}
        <Label htmlFor="description">Descripción del problema:</Label>
        <Textarea
          name="description"
          id="description"
          rows="3"
          {...register("description")}
        />
        <Label htmlFor="date">Fecha de Reserva:</Label>
        <Input
          type="date"
          name="date"
          {...register("date")}
          min={dayjs().format("YYYY-MM-DD")} 
        />
        
        <Label htmlFor="garantia">¿Su equipo cuenta con una garantía? </Label>
        <select
          name="garantia"
          {...register("garantia")}
          autoFocus
          className="garantia-select"
          style={{ marginTop: '10px',borderRadius: '5px'}}
        >
          <option value="">Seleccione una opción</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
        <div className="flex justify-center">
          <div className="flex space-x-4">
            <Button>Guardar Reserva</Button>
          </div>
        </div>
      </form>

      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Button onClick={openModal}>Ver Fechas Ocupadas</Button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Fechas disponibles"
        style={{
          content: {
            top: '50%',
            left: '60%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <div className="flex justify-center">
          <Button onClick={closeModal}>
            <img src="../src/imagenes/cerrar.png" alt="Cerrar" className="w-6 h-6" />
          </Button>
        </div>
        <MyCalendar />
      </Modal>
    </Card>
  );
}