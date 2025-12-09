import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await prisma.recipe.findUnique({
  where: { id: Number(params.id) },
});

  if (!recipe) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">Recept ni bil najden.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <a
        href="/"
        className="text-orange-600 hover:underline text-sm"
      >
        ← Nazaj na seznam
      </a>

      {/* IMAGE */}
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-80 object-cover rounded-xl mt-4 shadow-md"
        />
      )}

      {/* TITLE */}
      <h1 className="text-4xl font-bold mt-6 mb-4">{recipe.title}</h1>

      {/* INGREDIENTS */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Sestavine</h2>
        <p className="whitespace-pre-line text-gray-800 bg-gray-100 p-4 rounded-lg border">
          {recipe.ingredients}
        </p>
      </div>

      {/* STEPS */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Postopek</h2>
        <p className="whitespace-pre-line text-gray-800 bg-gray-100 p-4 rounded-lg border">
          {recipe.steps}
        </p>
      </div>

      {/* DATE */}
      <p className="text-gray-500 text-sm mt-4">
        Dodano: {new Date(recipe.createdAt).toLocaleDateString("sl-SI")}
      </p>
    </div>
  );
}
