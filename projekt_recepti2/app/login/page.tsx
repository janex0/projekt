'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Napačen email ali geslo.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border">

        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          Dobrodošel nazaj 👋
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 rounded-xl border"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Geslo"
            required
            className="w-full p-3 rounded-xl border"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white bg-orange-500"
          >
            {loading ? "Prijavljam..." : "Prijavi se"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 border rounded-lg py-2.5"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Nadaljuj z Google
          </button>
        </div>

      </div>
    </div>
  );
}
