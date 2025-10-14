"use client";

import igIcon from "@/app/images/ig-icon.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChangeEvent, useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const { registeruser, token } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (token) {
      push("/");
    }
  }, [token]);

  const handleregisteruser = async () => {
    const email = InputValues.email;
    const password = InputValues.password;
    const username = InputValues.username;
    await registeruser(email, password, username);
    if (token) {
      push("/");
    }
  };

  const [InputValues, setInputValues] = useState({
    email: "",
    password: "",
    username: "",
  });
  const handleValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      setInputValues((prev) => {
        return { ...prev, email: value };
      });
    }
    if (name === "password") {
      setInputValues((prev) => {
        return { ...prev, password: value };
      });
    }
    if (name === "username") {
      setInputValues((prev) => {
        return { ...prev, username: value };
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <img src={igIcon.src} alt="Instagram" className="h-16 w-16 mb-6" />
      <div
        className="text-[#71717A] font-bold text-[16px] justify-center
          width-[350px]"
      >
        Sign up to see photos and videos from your friends
      </div>

      <Card className="w-[350px] p-6 shadow-md border border-gray-200">
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Email"
            onChange={(e) => handleValues(e)}
            name="email"
          />
          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => handleValues(e)}
            name="password"
          />

          <Input
            placeholder="Username"
            type="Username"
            onChange={(e) => handleValues(e)}
            name="username"
          />

          <Button
            className="bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold hover:cursor-pointer"
            onClick={() => handleregisteruser()}
          >
            Sign up
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-medium text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Have an account? </span>
            <Link
              href="/login"
              className="font-semibold text-[#0095F6] hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Page;
