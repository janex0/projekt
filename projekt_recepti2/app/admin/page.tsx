import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// --- SERVER ACTION: DELETE RECIPE ---
export async function deleteRecipe(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.recipe.delete({
    where: { id },
  });

  // Optional: refresh page
}

export default async function AdminPage() {
  // AUTH CHECK
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  if (!token) {
    return <div className="p-10 text-center text-red-600">Dostop zavrnjen.</div>;
  }

  let userData: any;
  try {
    userData = jwt.verify(token.value, process.env.JWT_SECRET!);
  } catch {
    return <div className="p-10 text-center text-red-600">Neveljaven token.</div>;
  }

  if (userData.role !== "ADMIN") {
    return <div className="p-10 text-center text-red-600">Nimate pravic za dostop.</div>;
  }

  // GET ALL RECIPES
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Admin – Upravljanje receptov</h1>

      {recipes.length === 0 && <p>Ni dodanih receptov.</p>}

      <ul className="space-y-4">
  {recipes.map((r) => (
    <li
      key={r.id}
      className="p-4 border rounded-lg flex justify-between items-center"
    >
      <div>
        <h2 className="font-bold">{r.title}</h2>
        <p className="text-sm text-gray-500">ID: {r.id}</p>
      </div>

      <div className="flex gap-3">
        <a
          href={`/admin/edit/${r.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Uredi
        </a>

        <form action={deleteRecipe}>
          <input type="hidden" name="id" value={r.id} />
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Izbriši
          </button>
        </form>
      </div>
    </li>
  ))}
</ul>
    </div>
  );
}
