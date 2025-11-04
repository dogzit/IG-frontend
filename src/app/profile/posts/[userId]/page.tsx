"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";

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

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ig-backend-qfjz.onrender.com";

const Page = () => {
  const { push, back } = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  const { token, user } = useUser();
  const myid = user?._id;
  const [posts, setPosts] = useState<PostType[]>([]);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserPostData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/post/otherUser/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPosts(data || []);
    } catch (err) {
      console.error(err);
    }
  }, [token, userId]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/getOtherUserData/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOtherUser(data);
    } catch (err) {
      console.error(err);
    }
  }, [token, userId]);

  useEffect(() => {
    if (token && userId) {
      setLoading(true);
      Promise.all([fetchUserPostData(), fetchUserData()]).finally(() =>
        setLoading(false)
      );
    }
  }, [token, userId, fetchUserData, fetchUserPostData]);

  const followUser = async () => {
    const res = await fetch(`${BASE_URL}/follow-toggle/${userId}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (res.ok) {
      toast.success("Амжилттай дагалаа");
      fetchUserData();
    } else {
      toast.error("Алдаа гарлаа");
    }
  };

  const like = async (postId: string) => {
    const res = await fetch(`${BASE_URL}/post/toggle-like/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(myid!)
                  ? post.likes.filter((id) => id !== myid)
                  : [...post.likes, myid!],
              }
            : post
        )
      );
    }
  };

  const pushToComment = (postId: string) => push(`/comment/${postId}`);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto">
      {otherUser && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={
                otherUser.profilePicture ??
                "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
              }
              alt="profile"
              className="h-[60px] w-[60px] rounded-full object-cover border"
            />
            <div>
              <div className="font-semibold text-lg">{otherUser.username}</div>
              <div className="text-sm text-gray-500">
                {otherUser.followers.length} followers
              </div>
            </div>
          </div>
          {myid !== otherUser._id && (
            <Button onClick={followUser} size="sm">
              {otherUser.followers.includes(myid!) ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      )}

      {posts.map((post, index) => (
        <motion.div
          key={post._id}
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
            <div className="font-semibold text-gray-800 hover:underline">
              {otherUser?.username ?? "Unknown User"}
            </div>
          </div>

          {post.postImages?.[0] && (
            <img
              src={post.postImages[0]}
              alt="post"
              className="w-full object-cover max-h-[500px]"
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
                {post.likes.length} likes
              </div>

              <MessageCircle
                className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => pushToComment(post._id)}
              />
            </div>

            <div className="text-gray-800 text-sm leading-snug">
              <span className="font-semibold">{post.user?.username}</span>{" "}
              {post.caption}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Page;
