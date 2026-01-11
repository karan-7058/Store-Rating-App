import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/auth";

export default function OwnerLayout() {
  const { user , setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setUser(null); // VERY IMPORTANT
    navigate("/");
  }

  return (
    <div>
      <header style={{ padding: 20, background: "#ddd" }}>
        <Link to="/owner">Dashboard</Link> |{" "}
        <Link to="/owner/stores">My Stores</Link>

        <span style={{ float: "right" }}>
          Welcome <strong>{user?.name}</strong>{" "}
          <button onClick={handleLogout}>Logout</button>
        </span>
      </header>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
