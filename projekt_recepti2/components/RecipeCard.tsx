import { highlight } from "@/lib/utils/highlight";

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  imageUrl: string | null;
}

interface RecipeCardProps {
  recipe: Recipe;
  query: string;
}

/**
 * Komponenta za prikaz posamezne recept kartice
 * Prikazuje sliko, naslov, sestavine in link do recepta
 * Oznaci iskan niz v naslovu in sestavinah
 */
export default function RecipeCard({ recipe, query }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition overflow-hidden">
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
  );
}