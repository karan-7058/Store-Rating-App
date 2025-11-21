import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getSession();
        if (data?.user) setUser(data.user);
      } catch {}
      setLoading(false);
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
