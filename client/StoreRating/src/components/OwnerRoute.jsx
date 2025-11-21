import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OwnerRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || user.role_id !== 3) {
    return <Navigate to="/" replace />;
  }

  return children;
}
