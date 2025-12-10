import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- SERVER ACTION ZA POSODOBITEV ---
export async function updateRecipe(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const title = String(formData.get("title"));
  const ingredients = String(formData.get("ingredients"));
  const steps = String(formData.get("steps"));
  const imageUrl = String(formData.get("imageUrl"));

  await prisma.recipe.update({
    where: { id },
    data: { title, ingredients, steps, imageUrl },
  });
}

export default async function EditRecipePage(props: { params: Promise<{ id: string }> }) {
  // ⬅️⬅️ KLJUČNA POPRAVITEV
  const { id } = await props.params;
  const recipeId = Number(id);

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) return <div>Recept ne obstaja.</div>;

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Uredi recept</h1>

      <form action={updateRecipe} className="space-y-4 border p-6 rounded-lg">
        <input type="hidden" name="id" value={recipe.id} />

        <div>
          <label className="block font-semibold">Naslov</label>
          <input
            name="title"
            defaultValue={recipe.title}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Sestavine</label>
          <textarea
            name="ingredients"
            className="border p-2 w-full rounded h-32"
            defaultValue={recipe.ingredients}
          />
        </div>

        <div>
          <label className="block font-semibold">Postopek</label>
          <textarea
            name="steps"
            className="border p-2 w-full rounded h-32"
            defaultValue={recipe.steps}
          />
        </div>

        <div>
          <label className="block font-semibold">Slika (URL)</label>
          <input
            name="imageUrl"
            defaultValue={recipe.imageUrl || ""}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Shrani spremembe
        </button>
      </form>
    </div>
  );
}
