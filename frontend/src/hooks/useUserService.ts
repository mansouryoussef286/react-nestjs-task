import { useState } from "react";
import type { CurrentUser, SigninResModel } from "../models/user.model";

export type UserServiceHook = ReturnType<typeof useUserService>;

export const useUserService = () => {
  const [user, setUser] = useState<CurrentUser | null>(() => {
    const storedUser = localStorage.getItem("currentUser");
    try {
      return storedUser ? (JSON.parse(storedUser) as CurrentUser) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("accessToken");
    return storedToken ? storedToken : null;
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("refreshToken");
    return storedToken ? storedToken : null;
  });

  const clearUser = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const onSignin = (response: SigninResModel) => {
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(response.currentUser));
    setUser(response.currentUser);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
  };

  const onSignup = (response: SigninResModel) => {
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(response.currentUser));
    setUser(response.currentUser);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
  };

  const onSignout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    clearUser();
  };

  return {
    user,
    accessToken,
    refreshToken,
    onSignin,
    onSignup,
    onSignout,
  };
};
