"use client";
import RemoveButton from "@/app/images/X buttonIcon";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { upload } from "@vercel/blob/client";

import { ChangeEvent, useState } from "react";

const TOKEN = process.env.HF;
const Page = () => {
  const [promt, setPromt] = useState("");
  const [image, setImages] = useState("");
  const handleValues = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setPromt(value);
  };

  const fetchdata = async () => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          inputs: promt,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted ",
            num_inference_steps: 20,
            quidance_scale: 7.6,
          },
        }),
      }
    );
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    setImages(imageUrl);

    const file = new File([blob], "generated.png", { type: "image/png" });
    const uploaded = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
  };

  return (
    <div>
      <div>
        <a href="/createPost">
          <RemoveButton />
        </a>
        <div className="text-4 font-bold flex justify-center">
          New Photo Post
        </div>
      </div>

      <div className="flex-1 h-px bg-gray-200"></div>

      <div className="flex gap-3 flex-col p-4">
        <div className="text-5 font-bold text-[#09090B]">
          Explore AI generated images
        </div>
        <div className="text-[#71717A] text-[14px]">
          Describe what is on your mind. For best results, be specific
        </div>
        <div className="flex flex-col items-center gap-3">
          <Textarea
            onChange={(e) => handleValues(e)}
            placeholder="Example: Im walking in fog like Bladerunner 2049"
            className="text-[#71717A] text-[14px] h-25"
          />
        </div>
        <Button
          className="bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold hover:cursor-pointer"
          onClick={fetchdata}
        >
          Generate
        </Button>
      </div>
      <div className="flex justify-center p-4">
        <img src={image} className="rounded-lg shadow-md" />
      </div>
    </div>
  );
};
export default Page;
