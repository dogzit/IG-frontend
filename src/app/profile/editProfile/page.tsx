"use client";

import { useUser } from "@/providers/AuthProvider";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

const Page = () => {
  const { token } = useUser();
  const { push } = useRouter();
  const [usernameValue, setUsernameValue] = useState("");
  const [bioValue, setBioValue] = useState("");
  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameValue(e.target.value);
  };
  const handleBio = (e: ChangeEvent<HTMLInputElement>) => {
    setBioValue(e.target.value);
  };

  const saveChanges = async () => {
    const response = await fetch(`http://localhost:6969/editProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        bio: bioValue,
        username: usernameValue,
      }),
    });
    if (response.ok) {
      toast.success("User-iin medeelel amjilttai soliloo");
      push("/profile");
    } else {
      toast.error("User-iin medeelel solihod aldaa garlaa");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Edit Profile
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            onChange={(e) => handleUsername(e)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Bio</label>
          <input
            type="text"
            placeholder="Enter your bio"
            onChange={(e) => handleBio(e)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          className="w-full bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold py-2 rounded-md transition duration-200"
          onClick={() => saveChanges()}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
export default Page;
