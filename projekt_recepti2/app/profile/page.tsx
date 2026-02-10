import { auth } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="p-10 text-center text-lg">
        Niste prijavljeni.
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      recipes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return (
      <div className="p-10 text-center text-lg">
        Uporabnik ne obstaja.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-10">
      {/* PROFIL */}
      <section className="bg-white rounded-2xl shadow p-8 space-y-2">
        <h1 className="text-3xl font-bold">Profil</h1>

        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>

        <p>
          <span className="font-semibold">Ime:</span>{" "}
          {user.name ?? "Ni vneseno"}
        </p>

        <p>
          <span className="font-semibold">Vloga:</span>{" "}
          {user.role}
        </p>
      </section>

      {/* MOJI RECEPTI */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Moji recepti</h2>

        {user.recipes.length === 0 ? (
          <p className="text-gray-500">
            Še nimaš dodanih receptov.
          </p>
        ) : (
          <div className="grid gap-4">
            {user.recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex justify-between items-center bg-gray-100 p-5 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {recipe.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Dodano:{" "}
                    {new Date(recipe.createdAt).toLocaleDateString("sl-SI")}
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <Link
                    href={`/recipe/${recipe.id}`}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Odpri
                  </Link>
                  <Link
                    href={`/recipe/${recipe.id}/edit`}
                    className="text-sm text-gray-700 hover:underline"
                  >
                    Uredi
                  </Link>
                  <DeleteRecipeButton recipeId={recipe.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
