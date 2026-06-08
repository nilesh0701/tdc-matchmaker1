"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          Routing to The Date Crew Matchmaker Portal...
        </p>
      </div>
    </div>
  );
}