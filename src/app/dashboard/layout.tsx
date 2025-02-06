import NavBar from "@/components/NavBar";
import Loading from "./books/loading";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar />
      <Suspense fallback = {<Loading/>}>
        {children}
      </Suspense>
    </div>
  );
}
