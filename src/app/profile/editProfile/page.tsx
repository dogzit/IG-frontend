"use client";

import { useUser } from "@/providers/AuthProvider";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { token } = useUser();
  const { push } = useRouter();

  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [usernameValue, setUsernameValue] = useState("");
  const [bioValue, setBioValue] = useState("");

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

  const saveChanges = async () => {
    try {
      const response = await fetch(
        `https://ig-backend-qfjz.onrender.com/editProfile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bio: bioValue,
            username: usernameValue,
            profilePicture: image,
          }),
        }
      );

      if (response.ok) {
        toast.success("User profile updated successfully!");
        push("/profile");
      } else {
        toast.error("Failed to update user profile.");
      }
    } catch (err) {
      toast.error("An error occurred while saving changes.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Edit Profile
        </h2>

        <div>
          <label className="block text-gray-700 mb-1">Username</label>
          <Input
            type="text"
            placeholder="Enter your username"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Bio</label>
          <Input
            type="text"
            placeholder="Enter your bio"
            value={bioValue}
            onChange={(e) => setBioValue(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Profile Image</label>
          <Input type="file" accept="image/*" onChange={handleFile} />
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

        <Button
          onClick={uploadImage}
          disabled={uploading || !file}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            "Upload Image"
          )}
        </Button>

        <Button
          onClick={saveChanges}
          className="w-full bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Page;
