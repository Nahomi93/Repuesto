import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import axios from "axios";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { TaskProvider } from "./context/TaskContext";
import { TaskFormPage } from "./pages/TaskFormPage";

import { ClienteProvider } from "./context/ClienteContext";
import { ClienteFormPage } from "./pages/ClienteFormPage";
import { ClientesPage } from "./pages/ClientesPage";

import { AdministradorPage } from "./pages/AdministradorPage";
import { ClientehomePage } from "./pages/ClientehomePage";
import { TecnicohomePage } from "./pages/TecnicohomePage";

import { TecnicoProvider } from "./context/TecnicoContext";
import { TecnicoFormPage } from "./pages/TecnicoFormPage";
import { TecnicoPage } from "./pages/TecnicosPage";

import { ReparacionProvider } from "./context/ReparacionContext";
import { ReparacionFormPage } from "./pages/ReparacionFormPage";
import { ClienteCalificacion } from "./pages/ClienteCalificacion";
import { ReparacionesPage } from "./pages/ReparacionesPage";
import { HistorialReparacionesPage } from "./pages/HistorialReparacionesPage"; 

import { GarantiaFormPage } from "./pages/GarantiaFormPage";
import { GarantiasPage } from "./pages/GarantiasPage";
import { GarantiaProvider } from "./context/GarantiaContext";

function App() {
  // Verificación de sesión activa desde el inicio
  useEffect(() => {
    const startCamundaProcess = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/camunda/start-process",
          {
            processKey: "Process_0frnl0t", // Cambia por tu clave de proceso
            variables: {
              someVariable: { value: "example", type: "String" },
            },
          },
          { withCredentials: true } // Asegura el envío de cookies
        );
        console.log("Proceso iniciado:", response.data);
      } catch (error) {
        console.error("Error al iniciar el proceso:", error);
      }
    };
    startCamundaProcess();
  }, []);

  return (
    <AuthProvider>
      <TaskProvider>
        <ClienteProvider>
          <TecnicoProvider>
            <ReparacionProvider>
              <GarantiaProvider>
                <BrowserRouter>
                  <main className="container content-container mx-auto px-10 md:px-0">
                    <Navbar />
                    <Routes>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />

                      {/* Rutas protegidas */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/administradores" element={<AdministradorPage />} />
                        <Route path="/clientes" element={<ClientehomePage />} />
                        <Route path="/tecnicos" element={<TecnicohomePage />} />
                        <Route path="/profile" element={<h1>Perfil</h1>} />

                        <Route path="/cliente" element={<ClientesPage />} />
                        <Route path="/add-cliente" element={<ClienteFormPage />} />
                        <Route path="/clientes/:id" element={<ClienteFormPage />} />

                        <Route path="/tecnico" element={<TecnicoPage />} />
                        <Route path="/add-tecnico" element={<TecnicoFormPage />} />
                        <Route path="/tecnicos/:id" element={<TecnicoFormPage />} />

                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/add-task" element={<TaskFormPage />} />
                        <Route path="/tasks/:id" element={<TaskFormPage />} />

                        <Route path="/reparaciones" element={<ReparacionesPage />} />
                        <Route path="/reparaciones/:id" element={<ReparacionFormPage />} />
                        <Route path="/add-reparacion" element={<ReparacionFormPage />} />
                        <Route path="/historial-reparaciones" element={<HistorialReparacionesPage />} />
                        <Route path="/calificar/:id" element={<ClienteCalificacion />} />

                        <Route path="/garantias/:id" element={<GarantiaFormPage />} />
                        <Route path="/garantias" element={<GarantiasPage />} />
                        <Route path="/add-garantia" element={<GarantiaFormPage />} />
                      </Route>
                    </Routes>
                  </main>
                </BrowserRouter>
              </GarantiaProvider>
            </ReparacionProvider>
          </TecnicoProvider>
        </ClienteProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
