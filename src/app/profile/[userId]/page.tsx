"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";
type UserType = {
  createdAt: Date;
  followers: string[];
  following: string[];
  password: string;
  email: string;
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
  const params = useParams();
  const userId = params.userId;
  const { token, user } = useUser();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [otherUser, setOtherUser] = useState<UserType>();

  const fetchUserPostData = async () => {
    const response = await fetch(
      `https://ig-backend-jivs.onrender.com/post/otherUser/${userId}`,
      {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setPosts(data);
  };

  const fetchUserData = async () => {
    const response = await fetch(
      `https://ig-backend-jivs.onrender.com/getOtherUserData/${userId}`,
      {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log(data);
    setOtherUser(data);
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserPostData();
      fetchUserData();
    }
  }, [token, userId]);

  const followUser = async () => {
    const res = await fetch(
      `https://ig-backend-jivs.onrender.com/follow-toggle/${userId}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );
    if (res.ok) {
      toast.success("amjilttai dagala");
    } else {
      toast.error("aldaa garlaa");
    }
    fetchUserData();
  };

  return (
    <div className="p-4">
      <div className="flex justify-center font-bold text-2xl mb-3">
        {otherUser?.username}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            otherUser?.profilePicture ??
            "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          }
          alt="profile"
          className="rounded-full h-[100px] w-[100px] object-cover"
        />
        <div>
          <div className="font-bold text-lg">{otherUser?.username}</div>
          {otherUser?.followers?.includes(user?._id ?? "") ? (
            <Button
              className="bg-white hover:bg-gray-200 text-[#4DB5F9] font-semibold hover:cursor-pointer"
              onClick={() => followUser()}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              className="bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold hover:cursor-pointer"
              onClick={() => followUser()}
            >
              Follow
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-around mb-6 text-center">
        <div>
          <div className="font-bold text-xl">{posts.length}</div>
          <div className="text-gray-500 text-sm">Posts</div>
        </div>
        <div>
          <div className="font-bold text-xl">
            {otherUser?.followers?.length ?? 0}
          </div>
          <div className="text-gray-500 text-sm">Followers</div>
        </div>
        <div>
          <div className="font-bold text-xl">
            {otherUser?.following?.length ?? 0}
          </div>
          <div className="text-gray-500 text-sm">Following</div>
        </div>
        1
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
