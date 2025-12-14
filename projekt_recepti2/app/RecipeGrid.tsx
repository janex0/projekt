"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function highlight(text: string, query: string) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="bg-orange-200 text-black px-1 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function RecipeGrid({ recipes }: { recipes: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [loading, setLoading] = useState(false);

  // 🔁 debounce + loader
  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      router.replace(`/?${params.toString()}`);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, router]);

  return (
    <>
      {/* 🔍 SEARCH */}
      <div className="flex justify-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Išči recepte..."
          className="
            w-full max-w-xl
            p-4
            border-2 border-orange-500
            rounded-full
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
          "
        />
      </div>

      {/* 🔄 SKELETON */}
      {loading ? (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl border p-6 space-y-4"
            >
              <div className="h-40 bg-gray-200 rounded-xl" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        /* 📦 GRID */
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition overflow-hidden"
            >
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="h-52 bg-orange-100 flex items-center justify-center text-gray-400">
                  Brez slike
                </div>
              )}

              <div className="p-6 space-y-3">
                <h2 className="text-xl font-bold">
                  {highlight(recipe.title, query)}
                </h2>

                <p className="text-gray-600 line-clamp-3">
                  {highlight(recipe.ingredients, query)}
                </p>

                <a
                  href={`/recipe/${recipe.id}`}
                  className="text-orange-600 font-semibold inline-block"
                >
                  Poglej recept →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
