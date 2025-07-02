import { useEffect, useState } from "react";

export interface AuthUser {
  email: string;
  is_admin: boolean;
}

export function getUser(): Promise<AuthUser | null> {
  return fetch("http://localhost:5000/api/user", {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .catch(() => null);
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
} 