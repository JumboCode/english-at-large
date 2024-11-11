"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/*
 * Home Page
 * ...it's the home page.
 * eventually where the database will be at, depending on design flow.
 *
 *
 */
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to /dashboard when the component mounts
    router.push("/dashboard");
  }, [router]);
  return <div></div>;
}
