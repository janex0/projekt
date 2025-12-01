'use client';

import { useState } from 'react';

export default function AddRecipePage() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        ingredients,
        steps,
        imageUrl,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Recept uspešno dodan!");
      setTitle("");
      setIngredients("");
      setSteps("");
      setImageUrl("");
    } else {
      setMessage(data.error || "Napaka pri dodajanju recepta.");
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-start justify-center py-12">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10 border">
        
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
          Dodaj nov recept
        </h1>

        {message && (
          <p className="mb-6 text-center text-green-600 font-semibold text-lg">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block font-semibold mb-1">Naslov recepta</label>
            <input
              className="w-full p-3 border rounded-lg text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Npr. Čokoladna torta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Sestavine</label>
            <textarea
              className="w-full p-3 border rounded-lg text-black bg-gray-50 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Npr. 3 jajca, 200g moke, 100g sladkorja..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Postopek</label>
            <textarea
              className="w-full p-3 border rounded-lg text-black bg-gray-50 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Opisi korake priprave..."
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Slika (URL)</label>
            <input
              className="w-full p-3 border rounded-lg text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-lg transition-transform hover:scale-[1.02]"
          >
            Dodaj recept
          </button>

        </form>
      </div>
    </div>
  );
}
