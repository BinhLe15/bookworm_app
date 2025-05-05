import React, { ReactNode, useEffect, useState } from "react";
import { get_me, login, refresh } from "../services/api";
import { User } from "../types";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      setLoading(false);
      return;
    }
    setLoading(false);

    // Check if the refresh token is expired
    // Decode the refresh token to get the expiration time
    const now = new Date().toUTCString();
    const decodedRefreshToken = JSON.parse(atob(refresh_token.split(".")[1]));
    const refreshTokenExpireTime = new Date(
      decodedRefreshToken.exp * 1000
    ).toUTCString();

    if (refreshTokenExpireTime < now) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      return;
    }

    // Function to initialize authentication automatically when the app loads
    const initializeAuth = async () => {
      try {
        if (refresh_token === null) {
          console.log("No refresh token found, redirecting to login...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          return;
        }
        const response = await refresh(refresh_token);
        const { access_token } = response.data;
        localStorage.setItem("token", access_token);

        const userResponse = await get_me();

        const userData = userResponse.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error("Error during authentication initialization:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const loginUser = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Logging in with email:", email, "and password:", password);
      const response = await login(email, password);
      console.log("Login response:", response);
      const { access_token, user, refresh_token } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
