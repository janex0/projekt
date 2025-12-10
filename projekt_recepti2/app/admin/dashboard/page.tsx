import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const totalUsers = await prisma.user.count();
  const totalRecipes = await prisma.recipe.count();
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });

  const lastRecipe = await prisma.recipe.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded shadow">
          <h2 className="text-lg font-semibold">Uporabniki</h2>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>

        <div className="p-6 bg-white border rounded shadow">
          <h2 className="text-lg font-semibold">Recepti</h2>
          <p className="text-3xl font-bold">{totalRecipes}</p>
        </div>

        <div className="p-6 bg-white border rounded shadow">
          <h2 className="text-lg font-semibold">Admini</h2>
          <p className="text-3xl font-bold">{totalAdmins}</p>
        </div>
      </div>

      {lastRecipe && (
        <div className="p-6 bg-white border rounded shadow">
          <h2 className="text-lg font-semibold">Zadnji dodani recept</h2>
          <p className="text-xl font-bold">{lastRecipe.title}</p>
          <p className="text-gray-500">
            Dodano: {new Date(lastRecipe.createdAt).toLocaleDateString("sl-SI")}
          </p>
        </div>
      )}
    </div>
  );
}
