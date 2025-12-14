import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(params.id) },
  });

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Recept ni bil najden 😕</h1>
          <Link
            href="/"
            className="text-orange-600 font-medium hover:underline"
          >
            ← Nazaj na domov
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* IMAGE HEADER */}
        {recipe.imageUrl && (
          <div className="relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-6 left-6 text-white text-4xl font-extrabold drop-shadow-lg">
              {recipe.title}
            </h1>
          </div>
        )}

        {/* CONTENT */}
        <div className="p-8 space-y-10">

          {/* BACK */}
          <Link
            href="/"
            className="inline-block text-orange-600 font-medium hover:underline"
          >
            ← Nazaj na seznam
          </Link>

          {/* INGREDIENTS */}
          <section>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              🧺 Sestavine
            </h2>
            <div className="bg-gray-100 border rounded-xl p-5 whitespace-pre-line leading-relaxed">
              {recipe.ingredients}
            </div>
          </section>

          {/* STEPS */}
          <section>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              👨‍🍳 Postopek
            </h2>
            <div className="bg-gray-100 border rounded-xl p-5 whitespace-pre-line leading-relaxed">
              {recipe.steps}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="pt-6 border-t text-sm text-gray-500 flex justify-between items-center">
            <span>
              Dodano:{" "}
              {new Date(recipe.createdAt).toLocaleDateString("sl-SI")}
            </span>
            <span className="italic text-gray-400">Dober tek 😋</span>
          </footer>

        </div>
      </article>
    </div>
  );
}
