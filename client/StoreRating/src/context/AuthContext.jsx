import { createContext, useContext, useEffect, useState } from "react";
import { getSession, logout as apiLogout } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session on app start / refresh
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getSession();
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Proper logout
  async function logout() {
    try {
      await apiLogout();
    } catch {}
    setUser(null); // VERY IMPORTANT
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
