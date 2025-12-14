'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Napaka pri prijavi.");
    } else {
      router.push("/");
      router.refresh(); // ⬅️ Navbar se takoj posodobi
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border">

        {/* HEADER */}
        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          Dobrodošel nazaj 👋
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Prijavi se v svoj račun
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4 text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="npr. borut@email.com"
              required
              className="
                w-full p-3 rounded-xl border
                focus:outline-none focus:ring-2 focus:ring-orange-500
                transition
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geslo
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="
                w-full p-3 rounded-xl border
                focus:outline-none focus:ring-2 focus:ring-orange-500
                transition
              "
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl font-semibold text-white text-lg
              bg-gradient-to-r from-orange-500 to-red-500
              hover:opacity-90 transition
              disabled:opacity-60
            "
          >
            {loading ? "Prijavljam..." : "Prijavi se"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Nimaš računa?{" "}
          <a href="/signup" className="text-orange-600 font-semibold hover:underline">
            Registriraj se
          </a>
        </p>
      </div>
    </div>
  );
}
