import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ OBVEZNO await
  const { id } = await params;

  const recipeId = Number(id);

  // zaščita pred napačnim ID
  if (Number.isNaN(recipeId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Neveljaven ID recepta</h1>
      </div>
    );
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Recept ni bil najden 😕</h1>
          <Link href="/" className="text-orange-600 hover:underline">
            ← Nazaj na domov
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {recipe.imageUrl && (
          <div className="relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-6 left-6 text-white text-4xl font-extrabold">
              {recipe.title}
            </h1>
          </div>
        )}

        <div className="p-8 space-y-10">
          <Link href="/" className="text-orange-600 hover:underline">
            ← Nazaj na seznam
          </Link>

          <section>
            <h2 className="text-2xl font-bold mb-3">🧺 Sestavine</h2>
            <div className="bg-gray-100 p-5 rounded-xl whitespace-pre-line">
              {recipe.ingredients}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">👨‍🍳 Postopek</h2>
            <div className="bg-gray-100 p-5 rounded-xl whitespace-pre-line">
              {recipe.steps}
            </div>
          </section>

          <footer className="border-t pt-4 text-sm text-gray-500 flex justify-between">
            <span>
              Dodano:{" "}
              {new Date(recipe.createdAt).toLocaleDateString("sl-SI")}
            </span>
            <span>Dober tek 😋</span>
          </footer>
        </div>
      </article>
    </div>
  );
}
