import { auth } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await auth();

  // NI prijavljen
  if (!session?.user) {
    return (
      <div className="p-10 text-center text-red-600">
        Dostop zavrnjen.
      </div>
    );
  }

  // NI admina
  if (session.user.role !== "ADMIN") {
    return (
      <div className="p-10 text-center text-red-600">
        Nimate pravic za dostop.
      </div>
    );
  }

  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Admin – Upravljanje receptov
      </h1>

      {recipes.length === 0 && <p>Ni dodanih receptov.</p>}

      <ul className="space-y-4">
        {recipes.map((r) => (
          <li
            key={r.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold">{r.title}</h2>
              <p className="text-sm text-gray-500">
                Avtor ID: {r.userId}
              </p>
            </div>

            <a
              href={`/admin/edit/${r.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Uredi
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
