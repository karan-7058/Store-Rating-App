const API = "http://localhost:3000";

// Get stores created by owner
export async function getOwnerStores() {
  const res = await fetch(`${API}/storeowner/stores`, {
    credentials: "include",
  });
  return res.json();
}

// Get ratings for a specific store owned by owner
export async function getOwnerStoreRatings(id) {
  const res = await fetch(`${API}/storeowner/stores/${id}/ratings`, {
    credentials: "include",
  });
  return res.json();
}
