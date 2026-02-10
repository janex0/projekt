import { PrismaClient } from "@prisma/client";
import RecipeGrid from "./RecipeGrid";

const prisma = new PrismaClient();

/**
 * Glavna stran aplikacije - prikazuje mrežo receptov z iskanjem
 * Server komponenta ki pridobi podatke iz baze
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // 🔑 V Next.js 15+ so searchParams Promise - obvezno await
  const { q } = await searchParams;
  const query = q ?? "";

  // Pridobi recepte iz baze z iskanjem po naslovu ali sestavinah
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
