import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <nav style={{ padding: 20, background: "#ddd" }}>
        <Link to="/admin">Dashboard</Link> | 
        <Link to="/admin/stores">Stores</Link> |
        <Link to="/admin/users">Users</Link>
      </nav>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
