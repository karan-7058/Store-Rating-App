import { useState } from "react";
import { signup } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(""); // 👈 NEW

  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    const data = await signup({
      name,
      email,
      password,
      role_id: Number(role),
    });

    if (data.message) {
     navigate("/login");
   }

   
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br/>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>

        {/* 👇 ROLE SELECTION */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="2">Normal User</option>
          <option value="3">Store Owner</option>
        </select>
        <br/>

        <button>Signup</button>
      </form>
    </div>
  );
}
