import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const recipeId = Number(params.id);

  if (isNaN(recipeId)) {
    return <div>Neveljaven ID recepta.</div>;
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    return <div>Recept ne obstaja.</div>;
  }

  async function updateRecipe(formData: FormData) {
    "use server";

    await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title: formData.get("title") as string,
        ingredients: formData.get("ingredients") as string,
        steps: formData.get("steps") as string,
        imageUrl: formData.get("imageUrl") as string,
      },
    });

    redirect("/admin");
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Uredi recept</h1>

      <form action={updateRecipe} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Naslov</label>
          <input name="title" defaultValue={recipe.title} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Sestavine</label>
          <textarea
            name="ingredients"
            defaultValue={recipe.ingredients}
            className="w-full border p-2 rounded h-32"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Postopek</label>
          <textarea
            name="steps"
            defaultValue={recipe.steps}
            className="w-full border p-2 rounded h-32"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Slika URL</label>
          <input name="imageUrl" defaultValue={recipe.imageUrl ?? ""} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Shrani spremembe
        </button>
      </form>
    </div>
  );
}
