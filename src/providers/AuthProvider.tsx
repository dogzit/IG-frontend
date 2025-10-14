"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
type ContentType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;

  registeruser: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
};
type decodedTokenType = {
  data: User;
};
export type User = {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
};

export const AuthContext = createContext<ContentType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { push } = useRouter();
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken && typeof window.location !== undefined) {
      const decodedToken: decodedTokenType = jwtDecode(localToken);
      setToken(localToken);
      setUser(decodedToken.data);
    } else {
      push("/login");
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:6969/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setToken(token);
      setUser(decodedToken.data);
      if (token) {
        push("/");
      }

      toast.success("Log in succesfully!");
    } else {
      toast.error("Wrong password or email!");
    }
  };

  const registeruser = async (
    email: string,
    password: string,
    username: string
  ) => {
    const response = await fetch("http://localhost:6969/sign_up", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        username: username,
      }),
    });
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setToken(token);
      setUser(decodedToken.data);

      if (token) {
        push("/");
      }
      toast.success("Signed up succesfully!");
    } else {
      toast.error("Something went wrong!");
    }
  };

  const values = {
    user,
    login,
    registeruser,
    token,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "Auth context ashiglahiin tuld zaawal provider baih heregtei!"
    );
  }
  return authContext;
};
