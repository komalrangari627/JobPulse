import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

/* ================= CONTEXT ================= */

export const UserContext =
  createContext();

/* ================= PROVIDER ================= */

export const UserProvider = ({
  children,
}) => {

  /* ================= STATES ================= */

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(
      localStorage.getItem("token") || ""
    );

  /* ================= LOAD USER ================= */

  useEffect(() => {

    try {

      const storedUser =
        localStorage.getItem(
          "jobpulse_user"
        );

      // SAFE CHECK

      if (
        storedUser &&
        storedUser !== "undefined"
      ) {

        const parsedUser =
          JSON.parse(storedUser);

        setUser(parsedUser);
      }

    } catch (err) {

      console.error(
        "LocalStorage parse error:",
        err
      );

      localStorage.removeItem(
        "jobpulse_user"
      );
    }

  }, []);

  /* ================= LOGOUT ================= */

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "jobpulse_user"
    );

    setToken("");

    setUser(null);
  };

  /* ================= FETCH PROFILE ================= */

  const fetchUserProfile =
    async () => {

      if (!token) return;

      try {

        const res = await fetch(
          "http://localhost:5012/api/users/fetch-user-profile",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {

          logout();

          return;
        }

        const data =
          await res.json();

        if (data?.user) {

          setUser(data.user);

          localStorage.setItem(
            "jobpulse_user",
            JSON.stringify(
              data.user
            )
          );
        }

      } catch (err) {

        console.error(
          "Profile fetching error:",
          err
        );
      }
    };

  /* ================= AUTO FETCH ================= */

  useEffect(() => {

    fetchUserProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [token]);

  /* ================= RETURN ================= */

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

  return useContext(
    UserContext
  );
};