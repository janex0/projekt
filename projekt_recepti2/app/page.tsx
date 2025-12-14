import { PrismaClient } from "@prisma/client";
import RecipeGrid from "./RecipeGrid";

const prisma = new PrismaClient();

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // 🔑 OBVEZNO await
  const { q } = await searchParams;
  const query = q ?? "";

  const recipes = await prisma.recipe.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { ingredients: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      <h1 className="text-4xl font-extrabold text-center">🍽️ Recepti</h1>

      {/* CLIENT SIDE SEARCH */}
      <RecipeGrid recipes={recipes} />
    </div>
  );
}
