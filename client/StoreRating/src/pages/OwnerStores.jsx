import { useEffect, useState } from "react";
import { getOwnerStores } from "../api/storeOwner";
import { Link } from "react-router-dom";

export default function OwnerStores() {
  const [stores, setStores] = useState([]);

  async function loadStores() {
    const data = await getOwnerStores();
    setStores(data);
  }

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Stores</h1>

      {stores.length === 0 && <p>You have not created any stores yet.</p>}

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
            <h2>{store.name}</h2>
            <p>{store.description}</p>

            <Link
              to={`/owner/stores/${store.id}/ratings`}
              style={{ color: "blue" }}
            >
              View Ratings →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
