"use client";

import RemoveButton from "@/app/images/X buttonIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { upload } from "@vercel/blob/client";
import { ChangeEvent, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { token } = useUser();
  const router = useRouter();

  const [caption, setCaption] = useState("");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };

  const handleCaptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(event.target.value);
  };

  const fetchData = async () => {
    try {
      if (!prompt.trim()) {
        toast.error("Please enter a prompt!");
        return;
      }

      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const blob = await response.blob();
      const file = new File([blob], "generated.png", { type: "image/png" });
      console.log(file);
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImage(uploaded.url);
      toast.success("Image generated successfully ✨");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    try {
      if (!caption.trim() || !image) {
        toast.error("Please add both caption and image.");
        return;
      }

      setPosting(true);

      const response = await fetch(
        "https://ig-backend-qfjz.onrender.com/post/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: [image],
            caption,
          }),
        }
      );

      if (response.ok) {
        toast.success("Post амжилттай нэмлээ ✨");
        router.push("/");
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
        <Link href="/createPost">
          <RemoveButton />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">New Photo Post</h1>
        <div className="w-8" />
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Explore AI Generated Images
          </h2>
          <p className="text-gray-500 text-sm">
            Describe what is on your mind. For best results, be specific.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Textarea
            onChange={handleCaptionChange}
            placeholder="Write post caption here..."
            className="text-sm rounded-lg border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200"
          />
          <Textarea
            onChange={handlePromptChange}
            placeholder="Example: I'm walking in fog like Blade Runner 2049"
            className="text-sm rounded-lg border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 min-h-[100px]"
          />
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300 flex items-center gap-2"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>

          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300 flex items-center gap-2"
            onClick={createPost}
            disabled={posting}
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
              alt="Generated Preview"
              className="rounded-2xl shadow-xl border border-gray-200 max-w-md animate-fadeIn"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
