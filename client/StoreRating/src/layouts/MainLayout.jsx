import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <header style={{ padding: 20, background: "#eee" }}>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/signup">Register</Link>
      </header>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
