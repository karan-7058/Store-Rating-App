import { Outlet, Link } from "react-router-dom";

export default function OwnerLayout() {
  return (
    <div>
      <nav style={{ padding: 20, background: "#ddd" }}>
        <Link to="/owner">My Stores</Link>
      </nav>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
