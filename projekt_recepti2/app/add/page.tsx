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

    // vzamemo token iz cookie-jev
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      setMessage("Najprej se prijavi.");
      return;
    }

    const res = await fetch("/api/recipes/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    <div className="min-h-screen bg-white text-black flex items-center justify-center py-10">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8 border">
        
        <h1 className="text-3xl font-bold mb-6 text-center">Dodaj recept</h1>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="font-medium">Naslov</label>
            <input
              className="w-full p-3 border rounded-lg mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Vnesi naslov..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-medium">Sestavine</label>
            <textarea
              className="w-full p-3 border rounded-lg mt-1 text-black h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Vnesi sestavine..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-medium">Postopek</label>
            <textarea
              className="w-full p-3 border rounded-lg mt-1 text-black h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Vnesi postopek..."
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-medium">Slika (URL)</label>
            <input
              className="w-full p-3 border rounded-lg mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/sli
