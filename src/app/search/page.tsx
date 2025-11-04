"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import Link from "next/link";

import { ChangeEvent, useEffect, useState } from "react";

type User = {
  _id: string;
  username: string;
  profilePic?: string;
};

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { token } = useUser();

  const fetchUserData = async () => {
    const response = await fetch(
      "https://ig-backend-qfjz.onrender.com/getUserData",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(inputValue.toLowerCase())
  );
  console.log(users);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 bg-orange-50 min-h-screen">
      <Input
        onChange={handleInputValue}
        placeholder="Search by username"
        value={inputValue}
        className="mb-6"
      />
      <div className="space-y-4 flex flex-col gap-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link href={`/profile/${user._id}`} key={user._id}>
              <div className="flex items-center gap-4 p-4 rounded-lg border shadow-sm hover:shadow-md transition bg-orange-200">
                <Avatar className="w-14 h-14 border-2 border-orange-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-full">
                  <AvatarImage
                    src={user?.profilePic || ""}
                    alt={user?.username || "U"}
                    className="object-cover w-full h-full rounded-full"
                  />
                  <AvatarFallback className="bg-orange-100 text-gray-800 font-semibold text-lg">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-lg font-medium text-gray-800">
                  {user.username}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
