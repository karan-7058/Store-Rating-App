import { useEffect, useState } from "react";
import { getAdminUsers } from "../api/admin";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  async function loadUsers() {
    const data = await getAdminUsers();
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>

      {users.length === 0 && <p>No users found.</p>}

      <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.role_id}</td>
              <td>{new Date(u.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
