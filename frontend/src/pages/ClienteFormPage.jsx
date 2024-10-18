import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useClientes } from "../context/ClienteContext";
import { useForm } from "react-hook-form";
dayjs.extend(utc);

export function ClienteFormPage() {
  const { createCliente, getCliente, updateCliente } = useClientes();
  const navigate = useNavigate();
  const params = useParams();
  const {register, setValue, handleSubmit, formState: { errors },} = useForm();

  const onSubmit = async (data) => {
    try {
      
      if (params.id) {
        updateCliente(params.id, {
          ...data,
        });
      } else {
        data.rol = "Cliente";
        createCliente({
          ...data,
        });
      }
       navigate("/clientes");
    } catch (error) {
      console.log(error);
      // window.location.href = "/";
    }
  };

  useEffect(() => {
    async function loadCliente() {
      if (params.id) {
        const cliente = await getCliente(params.id);
        setValue("username", cliente.username);
        setValue("email", cliente.email);
        setValue("telefono", cliente.telefono);

      }
    };
    loadCliente();
  }, []);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-bold text-center mb-6 relative custom-title">
      Registro de Cliente</h1>
        <Label htmlFor="username">Usuario Cliente:</Label>
        <Input
          type="text"
          name="username"
          placeholder="Ingrese el usuario"
          {...register("username")}
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">Ingrese el usuario</p>
        )}

        <Label htmlFor="email">Teléfono:</Label>
        <Input
          type="number"
          name="telefono"
          placeholder="Ingrese el telefono"
          {...register("telefono")}
          autoFocus
        />

        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          name="email"
          placeholder="Ingrese el email"
          {...register("email")}
          autoFocus
        />

        <Label htmlFor="password">Contraseña:</Label>
        <Input
          type="password"
          name="password"
          placeholder="Ingrese el password"
          {...register("password")}
          autoFocus
        />
        
      <div className="flex justify-center">
      <Button>Guardar Cliente</Button>
      </div>
      </form>
    </Card>
  );
}