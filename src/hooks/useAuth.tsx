import React, { createContext, useContext, useState } from "react";

import { AuthService } from "../services/AuthService";
import jwtDecode from "jwt-decode";
import { NewUser } from "../models/newUser";
import { User } from "../models/user";

interface Token {
  user: User;
  exp: number;
}

export interface AuthInterface {
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (newUser: NewUser) => void;
  signout: () => void;
  getUserFullName: () => string;
  getDefaultImagePath: () => string;
  getFullImagePath: (imageName: string) => string;
}

const authContext = createContext<AuthInterface | null>(null);

export function ProvideAuth({ children }: any) {
  const auth: any = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth(): AuthInterface {
  const [user, setUser] = useState<User | null>(null);

  const signin = async (email: string, password: string) => {
    const { token } = await AuthService.login(email, password);

    if (token) {
      const decodedToken = jwtDecode<Token>(token);
      const jwtExpirationInMs = decodedToken.exp * 1000;
      const isExpired = new Date() > new Date(jwtExpirationInMs);

      if (isExpired) {
        return setUser(null);
      }

      if (decodedToken.user) {
        setUser(decodedToken.user);
      }
    }
  };

  const signup = (newUser: NewUser) => {
    AuthService.register(newUser);
  };

  const getUserFullName = () => {
    return `${user?.firstName} ${user?.lastName}`;
  };

  const getDefaultImagePath = () => {
    return "http://localhost:3000/api/feed/image/blank-profile-picture.png";
  };

  const getFullImagePath = (imageName: string) => {
    return `http://localhost:3000/api/feed/image/${imageName}`;
  };

  const signout = () => {
    AuthService.logout();
    setUser(null);
  };

  return {
    user,
    signin,
    signup,
    signout,
    getUserFullName,
    getDefaultImagePath,
    getFullImagePath,
  };
}
