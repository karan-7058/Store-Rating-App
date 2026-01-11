import { useEffect, useState } from "react";
import { getOwnerStores , createOwnerStore } from "../api/storeOwner";
import { Link } from "react-router-dom";

export default function OwnerStores() {

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
  name: "",
  description: "",
  address: "",
});

async function handleCreateStore(e) {
  e.preventDefault();

  if (!form.name) {
    alert("Store name is required");
    return;
  }

  const res = await createOwnerStore(form);

  if (res.error) {
    alert(res.error);
    return;
  }

  setForm({ name: "", description: "", address: "" });
  setShowForm(false);
  loadStores();
}


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

    {/* ---------- NO STORES CASE ---------- */}
    {stores.length === 0 && (
      <>
        <p>You have not created any stores yet.</p>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{ marginTop: "10px" }}
        >
          {showForm ? "Cancel" : "Create Your First Store"}
        </button>

        {showForm && (
          <form
            onSubmit={handleCreateStore}
            style={{
              marginTop: "20px",
              maxWidth: "400px",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "6px",
            }}
          >
            <input
              placeholder="Store Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
            <br /><br />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
            <br /><br />

            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              required
            />
            <br /><br />

            <button type="submit">Create Store</button>
          </form>
        )}
      </>
    )}

    {/* ---------- STORES LIST ---------- */}
    {stores.length > 0 && (
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
    )}
  </div>
);

}
