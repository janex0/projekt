'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteRecipeButton({ recipeId }: { recipeId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;
    const confirmed = window.confirm("Ste prepričani, da želite izbrisati recept?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/profile");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Napaka pri brisanju.");
      }
    } catch (err) {
      alert("Napaka pri brisanju.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:underline disabled:opacity-60"
    >
      {loading ? "Brišem..." : "Izbriši"}
    </button>
  );
}
