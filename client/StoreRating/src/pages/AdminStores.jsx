import { useEffect, useState } from "react";
import { getAdminStores, deleteAdminStore } from "../api/admin";

export default function AdminStores() {
  const [stores, setStores] = useState([]);

  async function loadStores() {
    const data = await getAdminStores();
    setStores(data);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this store?")) return;

    const res = await deleteAdminStore(id);

    if (res.error) {
      alert(res.error);
      return;
    }

    loadStores();
  }

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Stores</h1>

      {stores.length === 0 && <p>No stores available.</p>}

      {stores.map((store) => (
        <div
          key={store.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h2>{store.name}</h2>
          <p>{store.description}</p>
          <p>
            <strong>Owner:</strong> {store.owner_name} ({store.owner_email})
          </p>

          <button
            onClick={() => handleDelete(store.id)}
            style={{ marginTop: "10px" }}
          >
            Delete Store
          </button>
        </div>
      ))}
    </div>
  );
}
