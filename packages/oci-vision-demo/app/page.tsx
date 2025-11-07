"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    router.push("/login");
  }, [router]);

  return null;
}
