import { useEffect, useState } from "react";
import {  createAdminStore ,getAdminStores, deleteAdminStore } from "../api/admin";

export default function AdminStores() {
  const [stores, setStores] = useState([]);

  const [showForm, setShowForm] = useState(false);

const [form, setForm] = useState({
  name: "",
  description: "",
  address: "",
  created_by: "",
});

  async function loadStores() {
    const data = await getAdminStores();
    setStores(data);
  }

  async function handleCreateStore(e) {
  e.preventDefault();

  if (!form.name || !form.created_by) {
    alert("Store name and owner ID are required");
    return;
  }

  const res = await createAdminStore(form);

  if (res.error) {
    alert(res.error);
    return;
  }

  // reset form
  setForm({
    name: "",
    description: "",
    address: "",
    created_by: "",
  });

  // close form
  setShowForm(false);

  // refresh store list
  loadStores();
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

      <button
  onClick={() => setShowForm(!showForm)}
  style={{ marginBottom: "20px" }}
>
  {showForm ? "Cancel" : "Create Store"}
</button>

{showForm && (
  <form onSubmit={handleCreateStore} style={{ marginBottom: "30px" }}>
    <input
      placeholder="Store Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
    />
    <br /><br />

    <input
      placeholder="Description"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
    />
    <br /><br />

    <input
      placeholder="Address"
      value={form.address}
      onChange={(e) => setForm({ ...form, address: e.target.value })}
    />
    <br /><br />

    <input
      placeholder="admn ID"
      value={form.created_by}
      onChange={(e) => setForm({ ...form, created_by: e.target.value })}
    />
    <br /><br />

    <button type="submit">Save Store</button>
  </form>
)}


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
