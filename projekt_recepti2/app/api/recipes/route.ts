import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ✅ preveri prijavo (NextAuth)
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Niste prijavljeni." },
        { status: 401 }
      );
    }

    // ✅ najdi uporabnika
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Uporabnik ne obstaja." },
        { status: 404 }
      );
    }

    // ✅ preberi FormData
    const formData = await req.formData();

    const title = String(formData.get("title") || "");
    const ingredients = String(formData.get("ingredients") || "");
    const steps = String(formData.get("steps") || "");
    const imageUrl = formData.get("imageUrl")
      ? String(formData.get("imageUrl"))
      : null;

    if (!title || !ingredients || !steps) {
      return NextResponse.json(
        { error: "Vsa polja so obvezna." },
        { status: 400 }
      );
    }

    // ✅ shrani recept
    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        steps,
        imageUrl,
        userId: user.id,
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Napaka na strežniku." },
      { status: 500 }
    );
  }
}
