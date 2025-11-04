"use client";

import { ChangeEvent, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import RemoveButton from "../images/X buttonIcon";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { token } = useUser();
  const { push } = useRouter();

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const uploadImage = async () => {
    if (!file) {
      toast.warning("Please select an image first.");
      return;
    }

    try {
      setUploading(true);
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImage(uploaded.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const createPost = async () => {
    if (!image) {
      toast.warning("Please upload an image before posting.");
      return;
    }

    if (!caption.trim()) {
      toast.warning("Please write a caption.");
      return;
    }

    try {
      setPosting(true);

      const response = await fetch(
        "https://ig-backend-qfjz.onrender.com/post/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: [image],
            caption,
          }),
        }
      );

      if (response.ok) {
        toast.success("Post амжилттай нэмлээ ✨");
        push("/");
      } else {
        toast.error("Sorry, unable to create post.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the post.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <RemoveButton />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">New Photo Post</h1>
        <div className="w-8" />
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write caption here"
            className="max-w-sm"
          />
          <Input type="file" accept="image/*" onChange={handleFile} />

          <Button
            onClick={uploadImage}
            disabled={uploading || !file}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300 flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>

          <Button
            onClick={createPost}
            disabled={posting || !image}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300 flex items-center gap-2"
          >
            {posting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </div>

        {image && (
          <div className="flex justify-center p-4">
            <img
              src={image}
              alt="Preview"
              className="rounded-2xl shadow-xl border border-gray-200 max-w-md animate-fadeIn"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
