import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function RecipePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
  });

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Recept ni bil najden 😕</h1>
          <a href="/" className="text-orange-600 hover:underline">
            Nazaj na domov
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER / IMAGE */}
        {recipe.imageUrl && (
          <div className="relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <h1 className="absolute bottom-6 left-6 text-white text-4xl font-extrabold drop-shadow">
              {recipe.title}
            </h1>
          </div>
        )}

        {/* CONTENT */}
        <div className="p-8 space-y-10">

          {/* BACK LINK */}
          <a
            href="/"
            className="inline-block text-orange-600 font-medium hover:underline"
          >
            ← Nazaj na seznam
          </a>

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
          <div className="pt-6 border-t text-sm text-gray-500 flex justify-between items-center">
            <span>
              Dodano:{" "}
              {new Date(recipe.createdAt).toLocaleDateString("sl-SI")}
            </span>

            <span className="italic text-gray-400">
              Dober tek! 😋
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
