import { useEffect, useState } from "react";
import { getAllStores } from "../api/store";
import { Link } from "react-router-dom";

export default function Home() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    getAllStores().then(data => setStores(data));
  }, []);

  return (
    <div>
      <h2>All Stores</h2>

      {stores.map(store => (
        <div key={store.id} style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
          <h3>
            <Link to={`/store/${store.id}`}>{store.name}</Link>
          </h3>
          <p>{store.description}</p>
          <p>⭐ Avg Rating: {store.avg_score}</p>
        </div>
      ))}
    </div>
  );
}
