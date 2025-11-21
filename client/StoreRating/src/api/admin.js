const API = "http://localhost:3000";

// Get admin stats
export async function getAdminStats() {
  const res = await fetch(`${API}/admin/stats`, {
    credentials: "include",
  });
  return res.json();
}

// Get all users
export async function getAdminUsers() {
  const res = await fetch(`${API}/admin/users`, {
    credentials: "include",
  });
  return res.json();
}

// Get all stores
export async function getAdminStores() {
  const res = await fetch(`${API}/admin/stores`, {
    credentials: "include",
  });
  return res.json();
}

// Delete store
export async function deleteAdminStore(id) {
  const res = await fetch(`${API}/admin/stores/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}
