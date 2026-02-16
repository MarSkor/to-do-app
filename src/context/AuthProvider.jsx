import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  const loginUser = async (data) => {
    const res = await api.post("/auth/login", data);
    setUser(res.data.user);
    return res.data;
  };

  const registerUser = async (data) => {
    const res = await api.post("/auth/register", data);
    setUser(res.data.user);
    return res.data;
  };

  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/auth/me");
      setUser(null);
      return true;
    } catch (error) {
      console.error("Delete account failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logoutUser,
        loading,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
