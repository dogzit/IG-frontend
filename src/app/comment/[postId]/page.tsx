"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Page = () => {
  const { back } = useRouter();

  type Comment = {
    user: User;
    createdAt: string;
    comment: string;
  };
  type User = {
    username: string;
    profilePic: string;
  };

  const params = useParams();
  const postId = params.postId;
  const { token } = useUser();
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  console.log(comments);
  const createComment = async () => {
    if (!commentValue.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    const response = await fetch(
      "https://ig-backend-qfjz.onrender.com/comment/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: commentValue,
          postId: postId,
        }),
      }
    );

    if (response.ok) {
      toast.success("Comment added successfully!");
      setCommentValue("");
      fetchComment();
    } else {
      toast.error("Failed to add comment");
    }
  };

  const handleComment = (event: ChangeEvent<HTMLInputElement>) => {
    setCommentValue(event.target.value);
  };

  const fetchComment = async () => {
    const response = await fetch(
      `https://ig-backend-qfjz.onrender.com/comment/get/${postId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComment();
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <Button onClick={back} className="bg-gray-400">
        {"<"}
      </Button>
      <Card className="p-4 shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            💬 Write a Comment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={commentValue}
              onChange={handleComment}
              placeholder="Type your comment..."
              className="flex-1 border-gray-300 focus-visible:ring-1 focus-visible:ring-blue-400"
            />
            <Button
              onClick={createComment}
              className="bg-blue-600 hover:bg-blue-700 transition-all"
            >
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {comments.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No comments yet 😢</p>
        )}
        {comments.map((comment: Comment, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 flex gap-3 items-start">
                <Avatar>
                  <AvatarImage
                    src={comment.user?.profilePic || ""}
                    alt={comment.user?.username || "U"}
                  />
                  <AvatarFallback>
                    {comment.user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">
                    {comment.user?.username || "Anonymous"}
                  </p>
                  <p className="text-gray-600 text-sm">{comment.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Page;
