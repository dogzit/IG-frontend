"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
import { useEffect } from "react";
const Page = () => {
  const { user } = useUser();
  const { push } = useRouter();
  useEffect(() => {
    if (!user) push("/login");
  }, [user]);
  console.log(user, "enol user data ");

  return (
    <div>
      <a href="/createPost">Create Post</a>
      <div>{user}</div>
    </div>
  );
};
export default Page;
