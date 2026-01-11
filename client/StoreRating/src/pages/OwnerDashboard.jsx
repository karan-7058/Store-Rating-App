import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OwnerDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Store Owner Dashboard</h1>

      <p>
        Welcome{user?.name ? `, ${user.name}` : ""}! You can manage your stores here.
      </p>

      <Link
        to="/owner/stores"
        style={{ color: "blue", marginTop: "20px", display: "inline-block" }}
      >
        View My Stores →
      </Link>
      <br />  <br />

      
    </div>
  );
}

