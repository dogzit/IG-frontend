"use client";

import { useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type UserType = {
  createdAt: Date;
  email: string;
  followers: string[];
  following: string[];
  password: string;
  updatedAt: Date;
  username: string;
  _id: string;
  profilePicture?: string;
};

type PostType = {
  caption: string;
  createdAt: Date;
  likes: string[];
  postImages: string[];
  updatedAt: Date;
  user: UserType;
  _id: string;
};

const Page = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const { token, user } = useUser();
  const myid = user?._id;

  const allPost = async () => {
    const res = await fetch("https://ig-backend-jivs.onrender.com/post/get", {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    });

    const response = await res.json();
    setPosts(response);
  };

  useEffect(() => {
    if (token) allPost();
  }, [token]);

  const like = async (postId: string) => {
    await fetch(
      `https://ig-backend-jivs.onrender.com/post/toggle-like/${postId}`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }
    );
    allPost();
  };

  return (
    <div className="max-w-xl mx-auto mt-6 pb-20">
      {posts?.map((post, index) => (
        <motion.div
          key={index}
          className="mb-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-center gap-3 p-3 border-b border-gray-100">
            <img
              src={
                post.user?.profilePicture ??
                "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
              }
              alt="profile"
              className="rounded-full h-[45px] w-[45px] object-cover border border-gray-300"
            />
            <Link href={post.user ? `/profile/${post.user._id}` : "#"}>
              <div className="font-semibold text-gray-800 hover:underline">
                {post.user?.username ?? "Unknown User"}
              </div>
            </Link>
          </div>
          {post?.postImages?.[0] && (
            <img
              src={post.postImages[0]}
              alt="post"
              className="w-full h-auto object-cover rounded-b-none"
            />
          )}
          <div className="p-3">
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                whileTap={{ scale: 0.85 }}
                onClick={() => like(post._id)}
                className="cursor-pointer"
              >
                {post.likes.includes(myid!) ? (
                  <Heart color="red" fill="red" className="w-6 h-6" />
                ) : (
                  <Heart className="w-6 h-6" />
                )}
              </motion.div>
              <div className="text-gray-700 font-medium text-sm">
                {post?.likes.length ?? 0} likes
              </div>

              <Link href={`comment/${post._id}`}>
                <MessageCircle className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
              </Link>
            </div>
            <div className="text-gray-800 text-sm leading-snug">
              <span className="font-semibold">{post.user?.username}</span>:{" "}
              {post.caption}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Page;
