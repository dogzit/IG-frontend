"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";

type UserType = {
  createdAt: Date;
  email: string;
  followers: string[];
  following: string[];
  password: string;
  updatedAt: Date;
  username: string;
  profilePicture?: string;
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

  const fetchData = async () => {
    const response = await fetch(`http://localhost:6969/post/user`, {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  return (
    <div className="p-4">
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
          <Button className="font-semibold text-[black] hover:underline">
            Edit profile
          </Button>
        </div>
      </div>

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
            <img
              key={`${index}-${i}`}
              src={image}
              alt="post"
              className="w-full aspect-square object-cover hover:opacity-80 transition"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
