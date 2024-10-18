import { useEffect } from "react";
import { useClientes } from "../context/ClienteContext";
import { ClienteCard } from "../components/clientes/ClienteCard";
import { ImFileEmpty } from "react-icons/im";

export function AdministradorPage() {

  return (
    <>
      
        <div className="flex justify-center items-center p-10">
          <div>
            <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
            <h1 className="font-bold text-xl">
              Vista de Administrador
            </h1>
          </div>
        </div>
      

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">

      </div>
    </>
  );
}