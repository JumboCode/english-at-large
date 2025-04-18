"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import useCurrentUser from "@/lib/hooks/useCurrentUser";

export default function useVolunteerLevelRedirect() {
  const user = useCurrentUser();

  useEffect(() => {
    if (
      !(user?.role === UserRole.Admin || user?.role === UserRole.Volunteer) && // must be admin OR tutor
      user?.role !== undefined
    ) {
      redirect("/dashboard");
    }
  }, [user]);
}
