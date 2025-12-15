'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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

    // 1️⃣ USTVARI USERJA (poseben register endpoint)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Napaka pri registraciji");
      return;
    }

    // 2️⃣ TAKOJŠNJA PRIJAVA PREK NEXTAUTH
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">

        <div className="text-center">
          <h1 className="text-3xl font-extrabold">Ustvari račun</h1>
          <p className="text-gray-500">Pridruži se in dodajaj recepte 🍽️</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Ime"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />

          <button
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Registriram..." : "Registriraj se"}
          </button>
        </form>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          ali
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* GOOGLE */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full border rounded-lg py-2.5 flex justify-center gap-3"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Nadaljuj z Google
        </button>

        <p className="text-center text-sm">
          Imaš že račun?{" "}
          <a href="/login" className="text-orange-600 font-semibold">
            Prijavi se
          </a>
        </p>
      </div>
    </div>
  );
}
