"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

type UserType = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  followers: string[];
  following: string[];
  password: string;
  email: string;
  username: string;
  profilePicture?: string;
  bio: string;
};

type PostType = {
  _id: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  postImages: string[];
  user: UserType;
};

const Page = () => {
  const params = useParams();
  const userId = params.userId;
  const { token, user } = useUser();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);

  // Хэрэглэгчийн постуудыг татах
  const fetchUserPostData = async () => {
    try {
      const response = await fetch(
        `http://localhost:6969/post/otherUser/${userId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data: PostType[] = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load posts");
    }
  };

  // Хэрэглэгчийн мэдээллийг татах
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://localhost:6969/getOtherUserData/${userId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data: UserType = await response.json();
      setOtherUser(data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load user data");
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserPostData();
      fetchUserData();
    }
  }, [token, userId]);

  const followUser = async () => {
    try {
      const res = await fetch(`http://localhost:6969/follow-toggle/${userId}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to follow/unfollow");
      toast.success("Амжилттай хадгалагдлаа!");
      fetchUserData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Алдаа гарлаа");
    }
  };

  if (!otherUser) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-center font-bold text-2xl mb-3">
        {otherUser.username}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            otherUser.profilePicture ??
            "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          }
          alt="profile"
          className="rounded-full h-[100px] w-[100px] object-cover"
        />
        <div>
          <div className="font-bold text-lg">{otherUser.username}</div>
          {otherUser.followers.includes(user?._id ?? "") ? (
            <Button
              className="bg-white hover:bg-gray-200 text-[#4DB5F9] font-semibold"
              onClick={followUser}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              className="bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold"
              onClick={followUser}
            >
              Follow
            </Button>
          )}
        </div>
      </div>

      {otherUser.bio && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-1">About Me</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {otherUser.bio}
          </p>
        </div>
      )}

      <div className="flex justify-around mb-6 text-center">
        <div>
          <div className="font-bold text-xl">{posts.length}</div>
          <div className="text-gray-500 text-sm">Posts</div>
        </div>
        <div>
          <div className="font-bold text-xl">{otherUser.followers.length}</div>
          <div className="text-gray-500 text-sm">Followers</div>
        </div>
        <div>
          <div className="font-bold text-xl">{otherUser.following.length}</div>
          <div className="text-gray-500 text-sm">Following</div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) =>
          post.postImages.map((image, i) => (
            <Link
              key={`${post._id}-${i}`}
              href={`/profile/posts/${userId}`}
            >
              <img
                src={image}
                alt="post"
                className="w-full aspect-square object-cover hover:opacity-80 transition"
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
