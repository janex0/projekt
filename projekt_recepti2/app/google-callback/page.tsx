"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function finishLogin() {
      if (!session?.user?.email) return;

      await fetch("/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      router.push("/");
      router.refresh();
    }

    finishLogin();
  }, [session, router]);

  return <p className="p-10 text-center">Prijavljam...</p>;
}
