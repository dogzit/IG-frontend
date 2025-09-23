"use client";
import { useUser } from "@/providers/AuthProvider";
import { useEffect } from "react";
import igIcon from "@/app/images/ig-icon.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { login, user } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (user) {
      push("/");
    }
  }, [user]);

  const handleLogin = async () => {
    const email = InputValues.email;
    const password = InputValues.password;
    await login(email, password);
    if (user) {
      push("/");
    }
  };

  const [InputValues, setInputValues] = useState({
    email: "",
    password: "",
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
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <img src={igIcon.src} alt="Instagram" className="h-16 w-16 mb-6" />

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

          <Button
            className="bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold hover:cursor-pointer"
            onClick={() => handleLogin()}
          >
            Log in
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-medium text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <a
              href="/sign-up"
              className="font-semibold text-[#0095F6] hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Page;
