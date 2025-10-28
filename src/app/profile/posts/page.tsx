"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

import type { EmblaCarouselType } from "embla-carousel";

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

type EmblaCarouselProps = {
  post: PostType;
};

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({ post }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);

    onSelect(emblaApi);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const images = post.postImages;
  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <img
                src={img}
                alt={`Post image ${i + 1}`}
                className="object-cover w-full aspect-square"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === selectedIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const { push } = useRouter();
  const { user, token } = useUser();

  const myId = user?._id;
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://ig-backend-qfjz.onrender.com/post/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts 😞");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUserPosts();
  }, [token, fetchUserPosts]);

  const toggleLike = async (postId: string) => {
    if (!token) return toast.error("Please log in first!");

    const isLiked = posts.find((p) => p._id === postId)?.likes.includes(myId!);
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== myId)
                : [...post.likes, myId!],
            }
          : post
      )
    );

    try {
      const res = await fetch(
        `https://ig-backend-qfjz.onrender.com/post/toggle-like/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: isLiked
                    ? [...post.likes, myId!]
                    : post.likes.filter((id) => id !== myId),
                }
              : post
          )
        );
        throw new Error("Failed to toggle like");
      }

      toast.success(isLiked ? "Unliked 💔" : "Liked ❤️");
    } catch (err) {
      console.error(err);
      toast.error("Could not like post 😢");
    }
  };

  const goToComment = (postId: string) => push(`/comment/${postId}`);

  if (loading)
    return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto">
      {user && (
        <div className="flex items-center justify-between mb-6 p-3">
          <div className="flex items-center gap-3">
            <img
              src={
                user.profilePicture ??
                "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
              }
              alt="profile"
              className="h-[60px] w-[60px] rounded-full object-cover border"
            />
            <div>
              <div className="font-semibold text-lg">{user.username}</div>
              <div className="text-sm text-gray-500">
                {user.followers.length} followers
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={fetchUserPosts}>
            Refresh Posts
          </Button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No posts yet. Start sharing your first one! 📸
        </div>
      ) : (
        posts.map((post, index) => (
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
                {post.user?.username ?? "Unknown User"}
              </div>
            </div>

            {post?.postImages?.length > 0 && <EmblaCarousel post={post} />}

            <div className="p-3">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleLike(post._id)}
                  className="cursor-pointer"
                >
                  {post.likes.includes(myId!) ? (
                    <Heart color="red" fill="red" className="w-6 h-6" />
                  ) : (
                    <Heart className="w-6 h-6 text-gray-700" />
                  )}
                </motion.div>

                <div className="text-gray-700 font-medium text-sm">
                  {post.likes.length} likes
                </div>

                <MessageCircle
                  className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900"
                  onClick={() => goToComment(post._id)}
                />
              </div>

              <div className="text-gray-800 text-sm leading-snug">
                <span className="font-semibold">{post.user?.username}</span>{" "}
                {post.caption}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Page;
