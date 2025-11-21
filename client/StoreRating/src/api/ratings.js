const API = "http://localhost:3000";

// Update rating
export async function updateRating(id, score, comment) {
  const res = await fetch(`${API}/ratings/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, comment }),
  });
  return res.json();
}

// Delete rating
export async function deleteRating(id) {
  const res = await fetch(`${API}/ratings/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}
