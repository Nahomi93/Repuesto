import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import registroImage from "../imagenes/regisLogin.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function RegisterPage() {
  const { signup, errors: registerErrors, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (value) => {
    const dataWithRole = { ...value, rol: "Cliente" };
    try {
      await signup(dataWithRole);
      navigate("/clientes");
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/clientes");
    }
  }, [isAuthenticated, navigate]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative">
      <div className="flex flex-col justify-center items-center p-6 bg-[#dcdcdc] rounded-lg shadow-md w-full max-w-md ml-60">
        {registerErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-2xl font-bold mb-4">Registro</h1>

        <div className="flex justify-center mb-4">
          <img src={registroImage} alt="Logo Login" className="w-24 h-auto" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full">
          <div className="w-full mb-4">
            <Label htmlFor="username">
              <span className="font-bold text-gray-700">Usuario:</span>
            </Label>
            <Input
              type="text"
              name="username"
              placeholder="Ingrese su nombre de usuario"
              {...register("username")}
              autoFocus
              className="rounded-lg border-gray-300 p-2 w-full"
            />
            {errors.username?.message && (
              <p className="text-red-500 mt-1">{errors.username?.message}</p>
            )}
          </div>

          <div className="w-full mb-4">
            <Label htmlFor="email">
              <span className="font-bold text-gray-700">Correo:</span>
            </Label>
            <Input
              name="email"
              placeholder="correo@ejemplo.com"
              {...register("email")}
              className="rounded-lg border-gray-300 p-2 w-full"
            />
            {errors.email?.message && (
              <p className="text-red-500 mt-1">{errors.email?.message}</p>
            )}
          </div>

          <div className="w-full mb-4 relative">
            <Label htmlFor="password">
              <span className="font-bold text-gray-700">Contraseña:</span>
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              {...register("password")}
              className="rounded-lg border-gray-300 p-2 w-full"
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-2 top-11 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {errors.password?.message && (
              <p className="text-red-500 mt-1">{errors.password?.message}</p>
            )}
          </div>

          <div className="w-full mb-4 relative">
            <Label htmlFor="confirmPassword">
              <span className="font-bold text-gray-700">Confirmar contraseña:</span>
            </Label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="********"
              {...register("confirmPassword")}
              className="rounded-lg border-gray-300 p-2 w-full"
            />
            <button
              type="button"
              onClick={handleToggleConfirmPassword}
              className="absolute right-2 top-11 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {errors.confirmPassword?.message && (
              <p className="text-red-500 mt-1">{errors.confirmPassword?.message}</p>
            )}
          </div>

          <Button className="w-full mt-4">Registrarte</Button>
        </form>
        <p className="font-bold flex gap-x-2 justify-between mt-4">
          Ya tienes una cuenta?
          <Link className="text-[#dcae19]" to="/login">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
