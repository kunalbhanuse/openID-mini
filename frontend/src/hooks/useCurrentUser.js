import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useCurrentUser() {
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
    try {
      const response = await api("/o/user/me");
      setUser(response.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return { user, setUser, refreshUser };
}
