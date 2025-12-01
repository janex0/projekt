import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function HomePage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { id: "desc" }, // najnovejši prvi
  });

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Recepti</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition"
          >
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}

            <h2 className="text-2xl font-semibold mb-2">{recipe.title}</h2>

            <p className="text-gray-600 text-sm line-clamp-3">
              {recipe.ingredients}
            </p>

            <a
              href={`/recipe/${recipe.id}`}
              className="text-orange-600 font-semibold mt-3 inline-block hover:underline"
            >
              Poglej recept →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
