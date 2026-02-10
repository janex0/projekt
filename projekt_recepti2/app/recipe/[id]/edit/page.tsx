import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function EditOwnRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    const awaited = await params;
    redirect(`/login?callbackUrl=/recipe/${awaited.id}/edit`);
  }

  const { id } = await params;
  const recipeId = Number(id);

  if (Number.isNaN(recipeId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Neveljaven ID recepta.
      </div>
    );
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Recept ne obstaja.
      </div>
    );
  }

  const userId = Number(session.user.id);

  if (!userId || recipe.userId !== userId) {
    redirect(`/recipe/${recipeId}`);
  }

  async function updateRecipe(formData: FormData) {
    "use server";

    const currentSession = await auth();

    if (!currentSession?.user?.id) {
      redirect(`/login?callbackUrl=/recipe/${recipeId}/edit`);
    }

    const currentUserId = Number(currentSession.user.id);

    const recipeOwner = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { userId: true },
    });

    if (!recipeOwner || recipeOwner.userId !== currentUserId) {
      redirect(`/recipe/${recipeId}`);
    }

    const title = (formData.get("title") as string | null)?.trim() ?? "";
    const ingredients =
      (formData.get("ingredients") as string | null)?.trim() ?? "";
    const steps = (formData.get("steps") as string | null)?.trim() ?? "";
    const imageUrlRaw = (formData.get("imageUrl") as string | null)?.trim();
    const imageUrl = imageUrlRaw ? imageUrlRaw : null;

    if (!title || !ingredients || !steps) {
      return;
    }

    await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title,
        ingredients,
        steps,
        imageUrl,
      },
    });

    redirect(`/recipe/${recipeId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-10 space-y-8">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Urejate recept</p>
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
        </div>

        <form action={updateRecipe} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Naslov</label>
            <input
              name="title"
              defaultValue={recipe.title}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Sestavine</label>
            <textarea
              name="ingredients"
              defaultValue={recipe.ingredients}
              className="w-full border rounded-lg p-3 h-32"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Postopek</label>
            <textarea
              name="steps"
              defaultValue={recipe.steps}
              className="w-full border rounded-lg p-3 h-36"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Slika (URL)</label>
            <input
              name="imageUrl"
              defaultValue={recipe.imageUrl ?? ""}
              className="w-full border rounded-lg p-3"
              placeholder="https://primer.si/slika.jpg"
            />
          </div>

          <div className="flex gap-4">
            <a
              href={`/recipe/${recipe.id}`}
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border text-gray-700 hover:bg-gray-50"
            >
              Prekliči
            </a>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold"
            >
              Shrani spremembe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
