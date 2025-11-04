"use client";

import RemoveButton from "@/app/images/X buttonIcon";
import CreatePostIcon from "../images/createPostIcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const Page = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/" className="hover:opacity-70 transition">
          <RemoveButton />
        </Link>
        <h1 className="text-lg font-bold">New Photo Post</h1>
        <div className="w-6" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-24 h-24 text-gray-400">
            <CreatePostIcon />
          </div>
        </motion.div>

        <Link href={"galleryImageAdd"}>
          <Button className="bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold px-6 py-2 rounded-2xl shadow-md transition">
            Photo Library
          </Button>
        </Link>

        <Link href="/AI-generate">
          <Button className="bg-white border border-[#4DB5F9] text-[#4DB5F9] hover:bg-blue-50 font-semibold px-6 py-2 rounded-2xl transition">
            Generate with AI
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
