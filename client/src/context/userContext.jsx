import React, { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const fetchUserProfile = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        "http://localhost:5012/api/users/fetch-user-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Profile fetching error:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <UserContext.Provider
      value={{ user, token, setToken, logout, fetchUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

/* ✅ CUSTOM HOOK */
export const useUser = () => {
  return useContext(UserContext);
};
