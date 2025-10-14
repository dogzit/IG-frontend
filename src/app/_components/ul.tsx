import { CircleUser, House, Search, SquarePlus } from "lucide-react";
import Link from "next/link";

export const Ul = () => {
  return (
    <div className="fixed bottom-0 flex justify-between px-8 py-2 bg-white w-screen">
      <Link href="/">
        <House />
      </Link>
      <Link href="/search">
        <Search />
      </Link>
      <Link href="/createPost">
        <SquarePlus />
      </Link>
      <Link href="/profile">
        <CircleUser />
      </Link>
    </div>
  );
};
