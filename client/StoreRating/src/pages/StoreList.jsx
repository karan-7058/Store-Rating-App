import { useEffect, useState } from "react";
import { getAllStores } from "../api/store";
import { Link } from "react-router-dom";

export default function StoresList() {
  const [stores, setStores] = useState([]);

  async function loadStores() {
    const data = await getAllStores();
    setStores(data);
  }

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Stores</h1>

      {stores.length === 0 && <p>No stores available.</p>}

      <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
        {stores.map((store) => (
          <div
            key={store.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "6px",
            }}
          >
            <h2 style={{ marginBottom: "5px" }}>{store.name}</h2>

            <p style={{ margin: 0 }}>{store.description}</p>

            <p style={{ marginTop: "10px", color: "gray" }}>
              ⭐ <strong>{store.avg_score.toFixed(1)}</strong>  
              ({store.ratings_count} ratings)
            </p>

            <Link
              to={`/stores/${store.id}`}
              style={{
                marginTop: "10px",
                display: "inline-block",
                color: "blue",
              }}
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
