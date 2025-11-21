import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOwnerStoreRatings } from "../api/storeOwner";

export default function OwnerStoreRatings() {
  const { id } = useParams();
  const [ratings, setRatings] = useState([]);

  async function loadRatings() {
    const data = await getOwnerStoreRatings(id);
    setRatings(data);
  }

  useEffect(() => {
    loadRatings();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Store Ratings</h1>

      {ratings.length === 0 && <p>No ratings for this store yet.</p>}

      {ratings.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "12px",
          }}
        >
          <strong>{r.user_name}</strong> — ⭐ {r.score}
          <p>{r.comment}</p>
          <p style={{ color: "gray", fontSize: "13px" }}>
            {new Date(r.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
