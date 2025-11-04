"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { div } from "framer-motion/client";

type UserType = {
  createdAt: Date;
  email: string;
  followers: string[];
  following: string[];
  password: string;
  updatedAt: Date;
  username: string;
  profilePicture?: string;
  _id: string;
  bio: string;
};

type PostType = {
  caption: string;
  createdAt: Date;
  likes: number[];
  postImages: string[];
  updatedAt: Date;
  user: UserType;
};

const Page = () => {
  const { user, token } = useUser();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchData = async () => {
    const response = await fetch(
      `https://ig-backend-qfjz.onrender.com/post/user`,
      {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setPosts(data);
  };
  useEffect(() => {
    if (token) fetchData();
  }, [token]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-4 relative">
      <div className="flex justify-center font-bold text-2xl mb-3">
        {user?.username}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            user?.profilePicture ??
            "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          }
          alt="profile"
          className="rounded-full h-[100px] w-[100px] object-cover"
        />
        <div>
          <div className="font-bold text-lg">{user?.username}</div>
          <div className="flex gap-2 mt-1">
            <Link href={`/profile/editProfile`}>
              <Button className="font-semibold text-[black] hover:underline">
                Edit profile
              </Button>
            </Link>
            <Button
              onClick={() => setShowLogoutModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {user?.bio && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-1">About Me</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {user.bio}
          </p>
        </div>
      )}

      <div className="flex justify-around mb-6 text-center">
        <div>
          <div className="font-bold text-xl">{posts.length}</div>
          <div className="text-gray-500 text-sm">Posts</div>
        </div>
        <div>
          <div className="font-bold text-xl">
            {user?.followers?.length ?? 0}
          </div>
          <div className="text-gray-500 text-sm">Followers</div>
        </div>
        <div>
          <div className="font-bold text-xl">
            {user?.following?.length ?? 0}
          </div>
          <div className="text-gray-500 text-sm">Following</div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

      <div className="grid grid-cols-3 gap-1">
        {posts.map((post, index) =>
          post.postImages.map((image, i) => (
            <Link key={`${index}-${i}`} href={`/profile/posts`}>
              <img
                src={image}
                alt="post"
                className="w-full aspect-square object-cover hover:opacity-80 transition"
              />
            </Link>
          ))
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
