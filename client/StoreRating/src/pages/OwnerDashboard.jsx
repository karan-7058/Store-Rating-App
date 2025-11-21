import { Link } from "react-router-dom";

export default function OwnerDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Store Owner Dashboard</h1>

      <p>Welcome! You can manage your stores here.</p>

      <Link to="/owner/stores"
        style={{ color: "blue", marginTop: "20px", display: "inline-block" }}
      >
        View My Stores →
      </Link>
    </div>
  );
}
