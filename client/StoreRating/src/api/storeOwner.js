const API = "http://localhost:3000";

// Get stores created by owner
export async function getOwnerStores() {
  const res = await fetch(`${API}/owner/stores`, {
    credentials: "include",
  });
  return res.json();
}

// Get ratings for a specific store owned by owner
export async function getOwnerStoreRatings(id) {
  const res = await fetch(`${API}/owner/stores/${id}/ratings`, {
    credentials: "include",
  });
  return res.json();
}

export async function createOwnerStore(storeData) {
  const res = await fetch("http://localhost:3000/owner/stores", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storeData),
  });

  return res.json();
}

