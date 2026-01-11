const API = "http://localhost:3000/user";

// Get all stores
export async function getAllStores() {
  const res = await fetch(`${API}/stores`, {
    credentials: "include",
  });
  return res.json();
}

// Get single store details
export async function getStoreDetails(id) {
  const res = await fetch(`${API}/stores/${id}`, {
    credentials: "include",
  });
  return res.json();
}

// Add rating
export async function addRating(storeId, score, comment) {
  const res = await fetch(`${API}/stores/${storeId}/ratings`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, comment }),
  });

  return res.json();
}
