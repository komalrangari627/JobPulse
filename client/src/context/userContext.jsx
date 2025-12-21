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

  useEffect(() => {
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

    fetchUserProfile();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/* ✅ ADD THIS (THIS IS THE FIX) */
export const useUser = () => {
  return useContext(UserContext);
};