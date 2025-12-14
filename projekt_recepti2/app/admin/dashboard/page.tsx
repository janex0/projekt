import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const totalUsers = await prisma.user.count();
  const totalRecipes = await prisma.recipe.count();
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });

  const lastRecipe = await prisma.recipe.findFirst({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-10">

      {/* NASLOV */}
      <div>
        <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Pregled sistema in hitri dostop do administracije
        </p>
      </div>

      {/* STATISTIKA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Uporabniki" value={totalUsers} />
        <StatCard title="Recepti" value={totalRecipes} />
        <StatCard title="Admini" value={totalAdmins} />
      </div>

      {/* HITRI DOSTOP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminLink
          title="Vsi recepti"
          description="Pregled, urejanje in brisanje receptov"
          href="/admin"
        />
        <AdminLink
          title="Urejanje receptov"
          description="Neposredno urejanje posameznih receptov"
          href="/admin"
        />
        <AdminLink
          title="Profil admina"
          description="Pregled admin pravic"
          href="/profile"
        />
      </div>

      {/* ZADNJI RECEPT */}
      {lastRecipe && (
        <div className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-2">
            Zadnji dodani recept
          </h2>

          <p className="text-2xl font-bold">{lastRecipe.title}</p>

          <p className="text-gray-500 mt-1">
            Avtor: {lastRecipe.user?.email}
          </p>

          <p className="text-gray-500">
            Dodano:{" "}
            {new Date(lastRecipe.createdAt).toLocaleDateString("sl-SI")}
          </p>

          <Link
            href={`/admin/edit/${lastRecipe.id}`}
            className="inline-block mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Uredi recept
          </Link>
        </div>
      )}
    </div>
  );
}

/* ================== KOMPONENTE ================== */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-4xl font-extrabold">{value}</p>
    </div>
  );
}

function AdminLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition block"
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 mt-1">{description}</p>
      <span className="inline-block mt-3 text-orange-600 font-semibold">
        Odpri →
      </span>
    </Link>
  );
}
