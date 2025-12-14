'use client';

import { useState } from 'react';

export default function AddRecipePage() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
      credentials: "include",
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

          {/* NASLOV */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Naslov recepta
            </label>
            <input
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Npr. Čokoladna torta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* SESTAVINE */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Sestavine
            </label>
            <textarea
              className="w-full p-3 border rounded-xl bg-gray-50 h-32 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="3 jajca, 200g moke, 100g sladkorja ..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>

          {/* POSTOPEK */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Postopek
            </label>
            <textarea
              className="w-full p-3 border rounded-xl bg-gray-50 h-40 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Opisi korake priprave ..."
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
            />
          </div>

          {/* SLIKA */}
          <div className="space-y-4">
            <label className="block font-semibold text-gray-700">
              Slika recepta
            </label>

            {/* URL */}
            <input
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="URL slike (neobvezno)"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageFile(null);
                setPreview(e.target.value || null);
              }}
            />

            <div className="text-center text-gray-400 font-semibold">ALI</div>

            {/* UPLOAD */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-orange-400 rounded-xl p-6 cursor-pointer hover:bg-orange-50 transition">
              <span className="text-orange-600 font-semibold text-lg">
                📁 Izberi sliko iz računalnika
              </span>
              <span className="text-sm text-gray-500 mt-1">
                PNG, JPG, JPEG
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  setImageUrl("");
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  } else {
                    setPreview(null);
                  }
                }}
              />
            </label>

            {/* PREVIEW */}
            {preview && (
              <div className="mt-4">
                <p className="font-semibold mb-2 text-gray-700">Predogled slike:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-xl border shadow"
                />
              </div>
            )}
          </div>

          {/* GUMB */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
          >
            ➕ Dodaj recept
          </button>

        </form>
      </div>
    </div>
  );
}
