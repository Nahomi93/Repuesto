import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import logoImage from "../imagenes/logoLogin.png";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, signinCamunda, errors: loginErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Llamar a signin para la autenticación
      await signin(data);
  
      // Si signin es exitoso, iniciar el proceso en Camunda
      await signinCamunda(data);
  
      console.log("Autenticación y proceso de Camunda completados.");
    } catch (error) {
      console.error("Error durante el inicio de sesión o el proceso de Camunda:", error);
    }
  };
  

  useEffect(() => {
    if (isAuthenticated) {
      if (user.rol === "Cliente") {
        navigate("/clientes");
      } else if (user.rol === "Administrador") {
        navigate("/administradores");
      } else if (user.rol === "Tecnico") {
        navigate("/tecnicos");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative">
    <div className="flex mt-10 ml-72">
      {/* Sección del formulario */}
      <div style={{ backgroundColor: '#dcdcdc' }} className="flex flex-col justify-center items-center p-10 rounded-lg">
        {loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-2xl font-bold mb-4">Inicio de Sesión</h1>
        
        <div className="flex justify-center mb-4">
          <img src={logoImage} alt="Logo Login" className="w-24 h-auto" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full max-w-sm">
          <div className="w-full mb-4">
          <Label htmlFor="password"> <span className="font-bold text-gray-700">Correo:</span></Label>
            <Input
              label="Write your email"
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              {...register("email", { required: true })}
              className="rounded-lg border-gray-300"
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>

          <div className="w-full mb-4">
            <Label htmlFor="password"> <span className="font-bold text-gray-700">Contraseña:</span></Label>
            <Input
              type="password"
              name="password"
              placeholder="Ingrese su contraseña"
              {...register("password", { required: true, minLength: 6 })}
              className="rounded-lg border-gray-300"
            />
            <p className="text-red-500">{errors.password?.message}</p>
          </div>

          <Button className="w-full rounded-lg bg-blue-500 text-white">Ingresar</Button>
        </form>
        <p className="font-bold flex gap-x-2 justify-between mt-4">
          No tiene una cuenta? <Link to="/register" className="text-[#dcae19]">Regístrate</Link>
        </p>
      </div>
      <div style={{ backgroundColor: '#dcdcdc' }} className="flex flex-col justify-center items-center p-10 rounded-lg w-96 h-auto">
        <img 
          src="../src/imagenes/tecLogin.png" 
          alt="Imagen de inicio de sesión" 
          className=" object-cover rounded-lg" 
      />
      </div>


    </div>
    </section>
  );
}