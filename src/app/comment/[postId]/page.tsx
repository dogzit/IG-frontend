"use client";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const postId = params.postId;

  return <div>{postId}</div>;
};
export default Page;
