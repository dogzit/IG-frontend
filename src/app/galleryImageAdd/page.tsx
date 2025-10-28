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
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const { token } = useUser();
  const { push } = useRouter();


  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    setFiles(selectedFiles);
  };


  const uploadImages = async () => {
    if (files.length === 0) {
      toast.warning("Please select one or more images first.");
      return;
    }

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const uploaded = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploadedUrls.push(uploaded.url);
      }

      setImages(uploadedUrls);
      toast.success("All images uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload one or more images.");
    } finally {
      setUploading(false);
    }
  };

  // POST үүсгэх
  const createPost = async () => {
    if (images.length === 0) {
      toast.warning("Please upload at least one image before posting.");
      return;
    }

    if (!caption.trim()) {
      toast.warning("Please write a caption.");
      return;
    }

    try {
      setPosting(true);

      const response = await fetch("https://ig-backend-qfjz.onrender.com/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: images,
          caption,
        }),
      });

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

          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFile}
          />

          <Button
            onClick={uploadImages}
            disabled={uploading || files.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300 flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Images"
            )}
          </Button>

          <Button
            onClick={createPost}
            disabled={posting || images.length === 0}
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

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center p-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Preview ${i + 1}`}
                className="rounded-xl shadow-md border border-gray-200 max-h-48 object-cover animate-fadeIn"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
