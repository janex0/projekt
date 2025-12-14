'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Napaka pri registraciji.");
    } else {
      router.push("/");
      router.refresh(); // osveži Navbar
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Ustvari račun
          </h1>
          <p className="text-gray-500 text-sm">
            Pridruži se in začni dodajati recepte 🍽️
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 text-sm text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Ime */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ime
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Npr. Borut"
              required
              className="w-full rounded-lg border px-4 py-2 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="borut@email.com"
              required
              className="w-full rounded-lg border px-4 py-2 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Geslo */}
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
              className="w-full rounded-lg border px-4 py-2 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600
                       text-white font-semibold py-2.5 rounded-lg
                       transition disabled:opacity-60"
          >
            {loading ? "Registriram..." : "Registriraj se"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          ali
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* GOOGLE BUTTON (UI pripravljeno) */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3
                     border rounded-lg py-2.5 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">
            Nadaljuj z Google
          </span>
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500">
          Imaš že račun?{" "}
          <a href="/login" className="text-orange-600 font-medium hover:underline">
            Prijavi se
          </a>
        </p>

      </div>
    </div>
  );
}
