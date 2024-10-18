import { useEffect,useState  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card , Label, StarRating } from "../components/ui";
import { useReparaciones } from "../context/ReparacionContext";
import { useForm } from "react-hook-form";
dayjs.extend(utc);




export function ClienteCalificacion() {
  const { calificarReparacion } = useReparaciones();
  const navigate = useNavigate();
  const params = useParams();
  const {register, setValue, handleSubmit, formState: { errors },} = useForm();
  const [selectedRating, setSelectedRating] = useState(0);


  const onSubmit = async (data) => {
    try {
      if (params.id) {
        calificarReparacion(params.id,{calificacion: selectedRating});
      } 
       navigate("/reparaciones");
    } catch (error) {
      console.log(error);
      // window.location.href = "/";
    }
  };
  useEffect(() => {

  }, []);
  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold text-center mb-6 relative">
          Calificar Servicio
        </h1>
        <div className="flex justify-center mb-6">
          <StarRating onChange={(rate) => setSelectedRating(rate)}/>
        </div>
        <div className="flex justify-center">
          <Button>Calificar</Button>
        </div>
      </form>
    </Card>
  );
  
}