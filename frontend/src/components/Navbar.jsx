import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/styles.css";
import logoImage from "../imagenes/logoInfo.png";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(true);

  return (
    <div className="navbar-fixed flex">
      <div className={` ${open ? "w-72" : "w-20 "} bg-custom-zinc h-screen p-5 pt-8 relative duration-300`}>
        <img
          src="../src/imagenes/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <Link 
            to={
                 !isAuthenticated ? "/home" :
                 (user.rol === "Administrador" ? "/administradores" :
                  (user.rol === "Cliente" ? "/clientes" :
                  (user.rol === "Tecnico" ? "/tecnicos" : "/home")))
            }
          >
            <img src={logoImage} alt="Logo Infobest" className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`} />
          </Link>
        </div>
        <ul className="pt-6">
          {isAuthenticated ? (
            <>
              {user.rol === 'Cliente' && (
                <>
                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/reserva.png" alt="Clientes Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Reservas</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-task" className="flex items-center gap-x-4">
                          <span>Añadir Reserva</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/tasks" className="flex items-center gap-x-4">
                          <span>Ver Reserva</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2">
                    <NavLink to="/reparaciones" className="flex items-center gap-x-4">
                      <img src="./src/imagenes/clientereparacion.png" alt="Reparacion Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Ver Reparación</span>
                    </NavLink>
                  </li>
                </>
              )}

              {user.rol === 'Tecnico' && (
                <>
                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/reserva.png" alt="Clientes Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Reservas</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-task" className="flex items-center gap-x-4">
                          <span>Añadir Reserva</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/tasks" className="flex items-center gap-x-4">
                          <span>Ver Reserva</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/garantias.png" alt="Garantía Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Garantías</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-garantia" className="flex items-center gap-x-4">
                          <span>Añadir Garantía</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/garantias" className="flex items-center gap-x-4">
                          <span>Ver Garantía</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/reparacion.png" alt="Reparación Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Reparaciones</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-reparacion" className="flex items-center gap-x-4">
                          <span>Añadir Reparación</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/reparaciones" className="flex items-center gap-x-4">
                          <span>Historial de Reparaciones</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}    

              {user.rol === 'Administrador' && (
                <>
                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/clientes.png" alt="Clientes Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Clientes</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-cliente" className="flex items-center gap-x-4">
                          <span>Añadir Clientes</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/cliente" className="flex items-center gap-x-4">
                          <span>Ver Clientes</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
  
                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/tecnicos.png" alt="Técnicos Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Técnicos</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-tecnico" className="flex items-center gap-x-4">
                          <span>Añadir Técnicos</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/tecnico" className="flex items-center gap-x-4">
                          <span>Ver Técnicos</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/garantias.png" alt="Garantía Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Garantías</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-garantia" className="flex items-center gap-x-4">
                          <span>Añadir Garantía</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/garantias" className="flex items-center gap-x-4">
                          <span>Ver Garantía</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/reparacion.png" alt="Reparación Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Reparaciones</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-reparacion" className="flex items-center gap-x-4">
                          <span>Añadir Reparación</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/reparaciones" className="flex items-center gap-x-4">
                          <span>Ver Reparaciones</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/historial-reparaciones" className="flex items-center gap-x-4">
                          <span>Historial de reparaciones</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item relative">
                    <div className="flex items-center gap-x-4 cursor-pointer">
                      <img src="./src/imagenes/reserva.png" alt="Clientes Icon" />
                      <span className={`${!open && "hidden"} origin-left duration-200`}>Reservas</span>
                    </div>
                    <ul className="dropdown-content">
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/add-task" className="flex items-center gap-x-4">
                          <span>Añadir Reserva</span>
                        </NavLink>
                      </li>
                      <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                        <NavLink to="/tasks" className="flex items-center gap-x-4">
                          <span>Ver Reserva</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                </>
              )}
        
              <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2 nav-item">
                <Link to="/home" className="flex items-center gap-x-4" onClick={() => logout()}>
                  <img src="./src/imagenes/cerrarsesion.png" alt="Cerrar Sesión Icon" />
                  <span className={`${!open && "hidden"} origin-left duration-200`}>Cerrar Sesión</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2">
                <NavLink to="/login" className="flex items-center gap-x-4">
                  <img src="./src/imagenes/iniciarsesion.png" alt="Login Icon" />
                  <span className={`${!open && "hidden"} origin-left duration-200`}>Login</span>
                </NavLink>
              </li>
              <li className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-style items-center gap-x-4 mt-2">
                <NavLink to="/register" className="flex items-center gap-x-4">
                  <img src="./src/imagenes/cerrarsesion.png" alt="Registrar Icon" />
                  <span className={`${!open && "hidden"} origin-left duration-200`}>Registrar</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
