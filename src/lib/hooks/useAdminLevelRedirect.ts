"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import useCurrentUser from "@/lib/hooks/useCurrentUser";

export default function useAdminLevelRedirect() {
  const user = useCurrentUser();

  useEffect(() => {
    if (user?.role !== UserRole.Admin && user?.role !== undefined) {
      redirect("/dashboard");
    }
  }, [user]);
}
