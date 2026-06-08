import API from "../api/axios";
import React, { createContext, useState, useEffect, useContext } from "react";

/* ================= CONTEXT ================= */
export const UserContext = createContext();

/* ================= PROVIDER ================= */
export const UserProvider = ({ children }) => {
  /* ================= STATES ================= */
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  /* ================= LOAD USER FROM LOCALSTORAGE ================= */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("jobpulse_user");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("LocalStorage parse error:", err);
      localStorage.removeItem("jobpulse_user");
    }
  }, []);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jobpulse_user");

    setToken("");
    setUser(null);
  };

  /* ================= FETCH PROFILE ================= */
  const fetchUserProfile = async () => {
    if (!token) return;

    try {
      const res = await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      if (data?.user) {
        setUser(data.user);

        localStorage.setItem(
          "jobpulse_user",
          JSON.stringify(data.user)
        );
      }
    } catch (err) {
      console.error("Profile fetching error:", err.message);

      /* ✅ if token invalid → auto logout */
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  /* ================= AUTO FETCH ================= */
  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* ================= PROVIDER VALUE ================= */
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */
export const useUser = () => {
  return useContext(UserContext);
};