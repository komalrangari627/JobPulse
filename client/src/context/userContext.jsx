import { createContext, useContext, useEffect, useState } from "react";
import { requestUserProfile } from "../api/userAPI";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  /* FETCH USER PROFILE */
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ IMPORTANT FIX — prevent 401
      if (!token) {
        setLoadingUser(false);
        return;
      }

      const res = await requestUserProfile(token);
      setUser(res.data.user || res.data);
      setUserError(null);
    } catch (err) {
      console.error("profile fetching error :", err);
      setUser(null);
      setUserError(err);
    } finally {
      setLoadingUser(false);
    }
  };

  // ✅ FIX APPLIED HERE
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loadingUser,
        userError,
        fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
