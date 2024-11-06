"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard when the component mounts
    router.push("/dashboard");
  }, [router]);

  return <div></div>;
}
