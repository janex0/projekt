import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

// ➕ DODAJ RECEPT
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken");

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
    }

    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET!
    ) as { id: number };

    const body = await request.json();
    const { title, ingredients, steps, imageUrl } = body;

    if (!title || !ingredients || !steps) {
      return NextResponse.json(
        { error: "Vsa polja so obvezna." },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        steps,
        imageUrl,
        userId: decoded.id,
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Napaka na strežniku." },
      { status: 500 }
    );
  }
}
