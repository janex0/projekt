import { PrismaClient } from "@prisma/client";
import { getUser } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const userToken = await getUser();
  if (!userToken) {
    return <div className="p-10 text-center">Niste prijavljeni.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: userToken.id },
  });

  const recipes = await prisma.recipe.findMany({
    where: { userId: userToken.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-12">
      {/* PROFIL */}
      <section className="bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-1">Profil</h1>
        <p className="text-gray-500">{user?.email}</p>
      </section>

      {/* MOJI RECEPTI */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Moji recepti</h2>

        <div className="grid gap-4">
          {recipes.map(r => (
            <div
              key={r.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-xl"
            >
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-gray-500">
                  Dodano: {new Date(r.createdAt).toLocaleDateString("sl-SI")}
                </p>
              </div>

              <a
                href={`/admin/edit/${r.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Uredi
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* UREDI PROFIL */}
      <section className="bg-white rounded-2xl shadow p-8 max-w-xl">
        <h2 className="text-2xl font-semibold mb-4">Uredi profil</h2>

        <form
          action="/api/profile/update"
          method="POST"
          className="space-y-4"
        >
          <input
            name="name"
            defaultValue={user?.name ?? ""}
            placeholder="Ime"
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="password"
            name="password"
            placeholder="Novo geslo"
            className="border p-3 rounded-lg w-full"
          />

          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Shrani spremembe
          </button>
        </form>
      </section>
    </div>
  );
}
