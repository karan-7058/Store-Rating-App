import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStoreDetails, addRating } from "../api/store";
import { updateRating, deleteRating } from "../api/ratings";
import { useAuth } from "../context/AuthContext";

export default function StoreDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");

  // -----------------------------
  // Load Store + Ratings
  // -----------------------------
  async function loadStore() {
    const data = await getStoreDetails(id);
    setStore(data.store);
    setRatings(data.ratings);
  }

  useEffect(() => {
    loadStore();
  }, [id]);

  // -----------------------------
  // Add Rating
  // -----------------------------
  async function handleAddRating(e) {
    e.preventDefault();
    if (!user) {
      alert("Please login to rate.");
      return;
    }

    const res = await addRating(id, Number(score), comment);
    if (res.error) {
      alert(res.error);
      return;
    }

    setComment("");
    loadStore();
  }

  // -----------------------------
  // Edit Rating
  // -----------------------------
  async function handleEdit(r) {
    const newScore = prompt("Enter new score (1-5)", r.score);
    if (!newScore || newScore < 1 || newScore > 5) return;

    const newComment = prompt("Enter new comment", r.comment);

    const res = await updateRating(r.id, Number(newScore), newComment);
    if (res.error) {
      alert(res.error);
      return;
    }

    loadStore();
  }

  // -----------------------------
  // Delete Rating
  // -----------------------------
  async function handleDelete(ratingId) {
    if (!confirm("Are you sure you want to delete this rating?")) return;
    const res = await deleteRating(ratingId);

    if (res.error) {
      alert(res.error);
      return;
    }

    loadStore();
  }

  if (!store) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{store.name}</h1>
      <p>{store.description}</p>
      <p>
        <strong>Address:</strong> {store.address}
      </p>

      {/* ------------------------ */}
      {/* Ratings Section */}
      {/* ------------------------ */}
      <h2>Ratings</h2>

      {ratings.length === 0 && <p>No ratings yet.</p>}

      {ratings.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>{r.user_name}</strong> — ⭐ {r.score}
          <p>{r.comment}</p>

          {/* Only show Edit/Delete if user owns this rating */}
          {user && user.id === r.user_id && (
            <div style={{ marginTop: "5px" }}>
              <button
                onClick={() => handleEdit(r)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(r.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}

      {/* ------------------------ */}
      {/* Add Rating Form */}
      {/* ------------------------ */}
      {user ? (
        <form onSubmit={handleAddRating} style={{ marginTop: "20px" }}>
          <h3>Add Rating</h3>

          <label>Score:</label>
          <select value={score} onChange={(e) => setScore(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <br />
          <br />

          <label>Comment:</label>
          <br />
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", maxWidth: "400px" }}
          ></textarea>

          <br />
          <button type="submit" style={{ marginTop: "10px" }}>
            Submit Rating
          </button>
        </form>
      ) : (
        <p style={{ marginTop: "20px" }}>Login to add a rating.</p>
      )}
    </div>
  );
}
