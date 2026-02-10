"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import SearchInput from "@/components/SearchInput";
import SkeletonLoader from "@/components/SkeletonLoader";
import RecipeCard from "@/components/RecipeCard";

/**
 * Interface za recept iz baze podatkov
 */
interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  imageUrl: string | null;
}

/**
 * Glavna komponenta za prikaz mreže receptov z iskanjem
 * Uporablja debounce za optimizacijo iskanja in prikazuje loading stanje
 */
export default function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stanje za iskalni niz in loading indikator
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 300);
  const [loading, setLoading] = useState(false);

  // Posodobi URL z debounced query in upravljaj loading stanje
  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      router.replace(`/?${params.toString()}`);
      setLoading(false);
    }, 0); // Že debounced

    return () => clearTimeout(timeout);
  }, [debouncedQuery, router]);

  return (
    <>
      {/* 🔍 SEARCH */}
      <SearchInput value={query} onChange={setQuery} />

      {/* 🔄 SKELETON */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        /* 📦 GRID */
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} query={query} />
          ))}
        </div>
      )}
    </>
  );
}
