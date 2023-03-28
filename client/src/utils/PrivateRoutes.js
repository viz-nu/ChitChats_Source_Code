
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => localStorage.getItem("user-info") ?<Outlet /> : <Navigate to="/" />

export default PrivateRoutes
