const API = "http://localhost:3000";

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

export async function signup(payload) {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}


export async function getSession() {
  const res = await fetch(`${API}/auth/me`, {
    credentials: "include"
  });

  return res.json();
}

export async function logout() {
  const res = await fetch(`${API}/auth/logout`, {
    method: "POST",
    credentials: "include"
  });

  return res.json();
}

