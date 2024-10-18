import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useTecnicos } from "../context/TecnicoContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
dayjs.extend(utc);

export function TecnicoFormPage() {
  const { createTecnico, getTecnico, updateTecnico } = useTecnicos();
  const navigate = useNavigate();
  const params = useParams();
  const {register, setValue, handleSubmit, formState: { errors },} = useForm();

  const onSubmit = async (data) => {
    try {
      if (params.id) {
        updateTecnico(params.id, {
          ...data,
          date: dayjs.utc(data.date).format(),
        });
      } else {
        data.rol = "Tecnico";
        createTecnico({
          ...data,
          date: dayjs.utc(data.date).format(),
        });
      }
       navigate("/tecnico");
    } catch (error) {
      console.log(error);
      // window.location.href = "/";
    }
  };

  useEffect(() => {
    async function loadTecnico() {
      if (params.id) {
        const tecnico = await getTecnico(params.id);
        setValue("username", tecnico.username);
        setValue("email", tecnico.email);
        setValue("telefono", tecnico.telefono);

      }
    };
    loadTecnico();
  }, []);

  return (
<Card>
      <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-bold text-center mb-6 relative custom-title">
      Registro de Técnico</h1>
        <Label htmlFor="username">Usuario Técnico:</Label>
        <Input
          type="text"
          name="username"
          placeholder="Ingrese el usuario"
          {...register("username")}
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">Ingrese el Usuario</p>
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
      <Button>Guardar Técnico</Button>
      </div>
      </form>
    </Card>
  );
}