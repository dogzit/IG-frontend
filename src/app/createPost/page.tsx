import RemoveButton from "@/app/images/X buttonIcon";
import CreatePostIcon from "../images/createPostIcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <div>
      <div>
        <Link href="/">
          <RemoveButton />
        </Link>
        <div className="text-4 font-bold flex justify-center">
          New Photo Post
        </div>
      </div>

      <div className="flex-1 h-px bg-gray-200"></div>
      <div>
        <div className="flex flex-col items-center gap-3">
          <CreatePostIcon />
          <Button className="bg-[#4DB5F9] hover:bg-[#3aa7f5] text-white font-semibold hover:cursor-pointer">
            Photo library
          </Button>
          <a href="AI-generate">
            <Button className="bg-white text-[#4DB5F9] font-semibold hover:cursor-pointer">
              Generate with AI
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
export default Page;
