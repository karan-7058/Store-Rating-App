import { Outlet, Link , useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/auth";

export default function MainLayout() {
  const { user, setUser} = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setUser(null); // VERY IMPORTANT
    navigate("/"); // go to public home
  }

  return (
    <div>
      <header
        style={{
          padding: 20,
          background: "#eee",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left side */}
        <div>
          <Link to="/">Home</Link>
        </div>

        {/* Right side */}
        <div>
          {!user ? (
            <>
              <Link to="/login">Login</Link> |{" "}
              <Link to="/signup">Register</Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: 10 }}>
                Welcome <strong>{user.name}</strong>
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
