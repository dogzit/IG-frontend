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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";

// ✅ Type definitions
type User = {
  username?: string;
  profilePicture?: string;
};

type CommentType = {
  _id: string;
  comment: string;
  createdAt: string;
  user?: User;
};

const Page = () => {
  const { back } = useRouter();
  const params = useParams();
  const postId = params.postId;
  const { token } = useUser();

  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const handleComment = (event: ChangeEvent<HTMLInputElement>) => {
    setCommentValue(event.target.value);
  };

  const createComment = async () => {
    if (!commentValue.trim()) {
      toast.error("💬 Comment cannot be empty!");
      return;
    }

    try {
      const response = await fetch("https://ig-backend-qfjz.onrender.com/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: commentValue,
          postId: postId,
        }),
      });

      if (response.ok) {
        toast.success("✅ Comment added!");
        setCommentValue("");
        fetchComment();
      } else {
        const err = await response.text();
        toast.error(`❌ Failed to add comment: ${err || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong while adding comment.");
    }
  };

  const fetchComment = async () => {
    try {
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
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data: CommentType[] = await response.json();
      setComments(data);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Failed to load comments");
    }
  };

  useEffect(() => {
    if (token) fetchComment();
  }, [token]);

  const deleteComment = async (commentId: string) => {
    setLoadingDeleteId(commentId);
    toast.loading("🗑️ Deleting comment...");

    try {
      const response = await fetch(
        `https://ig-backend-qfjz.onrender.com/comment/delete/${commentId}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();

      if (!response.ok) {
        toast.error("❌ Failed to delete comment");
        return;
      }

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("🧹 Comment deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("⚠️ Something went wrong while deleting comment.");
    } finally {
      setLoadingDeleteId(null);
    }
  };

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
        {comments.map((comment, i) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-lg">
              <CardContent className="p-4 flex gap-4 items-start relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={comment.user?.profilePicture || ""}
                    alt={comment.user?.username || "U"}
                  />
                  <AvatarFallback>
                    {comment.user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {comment.user?.username || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={loadingDeleteId === comment._id}
                          className={`text-red-500 hover:bg-red-50 ${
                            loadingDeleteId === comment._id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="bg-white dark:bg-neutral-900">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600">
                            Delete Comment?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-500">
                            This action cannot be undone. Are you sure you want
                            to delete this comment?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-white">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => deleteComment(comment._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {comment.comment}
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
