const API = "http://localhost:3000";

export async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

export async function signup(email, password, name) {
  const res = await fetch(`${API}/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  return res.json();
}

export async function getSession() {
  const res = await fetch(`${API}/me`, {
    credentials: "include"
  });

  return res.json();
}

export async function logout() {
  const res = await fetch(`${API}/logout`, {
    method: "POST",
    credentials: "include"
  });

  return res.json();
}

