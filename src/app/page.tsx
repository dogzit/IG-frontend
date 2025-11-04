"use client";

import { useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, EllipsisVertical } from "lucide-react";
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
  bio: string;
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

  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const allPost = async () => {
    const res = await fetch("https://ig-backend-qfjz.onrender.com/post/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    const response = await res.json();
    if (Array.isArray(response)) {
      setPosts(response);
    } else if (Array.isArray(response.posts)) {
      setPosts(response.posts);
    } else {
      setPosts([]);
    }
  };

  useEffect(() => {
    if (token) {
      allPost();
    }
  }, [token]);

  const like = async (postId: string) => {
    await fetch(
      `https://ig-backend-qfjz.onrender.com/post/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    allPost();
  };

  const handleDelete = async (postId: string) => {
    const res = await fetch(
      `https://ig-backend-qfjz.onrender.com/post/delete/${postId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      }
    );

    if (res.ok) {
      setConfirmDeleteOpen(false);
      setPostToDelete(null);
      allPost();
    } else {
      console.error("Failed to delete post");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 pb-20">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          className="mb-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 relative"
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
            <div className="flex items-center justify-between w-full">
              <Link
                href={
                  post.user?._id === myid
                    ? "/profile"
                    : `/profile/${post.user._id}`
                }
              >
                <div className="font-semibold text-gray-800 hover:underline">
                  {post.user?.username ?? "Unknown User"}
                </div>
              </Link>

              {post.user._id === myid && (
                <div className="relative">
                  <EllipsisVertical
                    className="text-gray-500 cursor-pointer"
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === post._id ? null : post._id
                      )
                    }
                  />
                  {activeDropdown === post._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-md rounded-md z-10">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setActiveDropdown(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          setPostToDelete(post._id);
                          setConfirmDeleteOpen(true);
                          setActiveDropdown(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {post?.postImages?.[0] && (
            <img
              src={post.postImages[0]}
              alt="post"
              className="w-full h-auto object-cover"
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
              <span className="font-semibold">{post.user?.username}</span>{" "}
              {post.caption}
            </div>
          </div>
        </motion.div>
      ))}

      {confirmDeleteOpen && postToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  setPostToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(postToDelete)}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
