import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/todos" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
