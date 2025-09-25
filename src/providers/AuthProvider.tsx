"use client";

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
  user: User | null; // энд User | null гэж зөв заах хэрэгтэй
  login: (email: string, password: string) => Promise<void>;
  registeruser: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
};

type User = {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
};
export const AuthContext = createContext<ContentType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const { push } = useRouter();
  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      setUser(JSON.parse(userItem));
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
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      if (user) {
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
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      if (user) {
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
