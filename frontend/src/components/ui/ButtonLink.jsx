import { Link } from "react-router-dom";

export const ButtonLink = ({ to, children }) => (
  <Link
    to={to}
    className="bg-[#86B250] hover:bg-[#739A43] text-white font-bold px-4 py-1 rounded-md mt-4 transition duration-300 mr-4"
    style={{ marginRight: '10px' }} // Establecer margen derecho personalizado
  >
    {children}
  </Link>
);
