'use client';

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function AddRecipePage() {
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // ⛔ če ni prijavljen
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">Za dodajanje recepta se moraš prijaviti.</p>
        <button
          onClick={() => signIn()}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Prijavi se
        </button>
      </div>
    );
  }

  // ⏳ loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Nalagam…
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    const res = await fetch("/api/recipes", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Recept uspešno dodan!");
      setTitle("");
      setIngredients("");
      setSteps("");
      setImageUrl("");
      setImageFile(null);
      setPreview(null);
    } else {
      setMessage(data.error || "❌ Napaka pri dodajanju recepta.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-16 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10 border">

        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          🍰 Dodaj nov recept
        </h1>

        {message && (
          <div className="mb-6 text-center font-semibold text-green-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          <div>
            <label className="block mb-2 font-semibold">Naslov recepta</label>
            <input
              className="w-full p-3 border rounded-xl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Sestavine</label>
            <textarea
              className="w-full p-3 border rounded-xl h-32"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Postopek</label>
            <textarea
              className="w-full p-3 border rounded-xl h-40"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block font-semibold">Slika</label>

            <input
              className="w-full p-3 border rounded-xl"
              placeholder="URL slike"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageFile(null);
                setPreview(e.target.value || null);
              }}
            />

            <div className="text-center text-gray-400">ALI</div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer">
              <span className="font-semibold">📁 Izberi sliko</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  setImageUrl("");
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-xl"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg"
          >
            ➕ Dodaj recept
          </button>

        </form>
      </div>
    </div>
  );
}
