import { useEffect, useState } from "react";
import { getAdminStats } from "../api/admin";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  async function loadStats() {
    const data = await getAdminStats();
    setStats(data);
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginTop: "20px", lineHeight: "2" }}>
        <p><strong>Total Users:</strong> {stats.totalUsers}</p>
        <p><strong>Total Ratings:</strong> {stats.totalRatings}</p>
        <p><strong>Total Stores:</strong> {stats.totalStores}</p>
      </div>

       <Link to="/">logout</Link>
    </div>
  );
}
