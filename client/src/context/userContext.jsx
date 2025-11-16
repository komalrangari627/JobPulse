import { useState, useEffect, createContext, useContext, Children} from "react";
import { requestUserProfile } from "../api/userAPI.js";

const userContext = createContext();

let UserProvider = ({ children }) => {

    const [user, setUser] = useState({
        logedIn: false
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // FETCH USER PROFILE
    
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            //  No token → logout user
            if (!token) {
                setUser({ logedIn: false });
                return;
            }

            const result = await requestUserProfile(token);

            //  API failed
            if (result.status !== 200) {
                throw new Error("Unable to fetch user profile!");
            }

            //  Set user data
            setUser({
                ...result.data.userData,
                logedIn: true
            });

        } catch (err) {
            console.log("profile fetching error:", err);

            //  Remove invalid/expired token
            localStorage.removeItem("token");

            setError(err.message || "Something went wrong");
            setUser({ logedIn: false });

        } finally {
            setLoading(false);
        }
    };

    // LOGOUT FUNCTION
    
    const logout = () => {
        localStorage.removeItem("token");
        setUser({ logedIn: false });
    };

    return (
        <userContext.Provider value={{
            user,
            loading,
            error,
            fetchUserProfile,
            logout
        }}>
            {children}
        </userContext.Provider>
    );
};

const useUser = () => useContext(userContext);

export { UserProvider, useUser };
