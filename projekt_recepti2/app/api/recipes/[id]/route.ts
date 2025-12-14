import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ params so Promise
    const { id } = await context.params;
    const recipeId = Number(id);

    if (Number.isNaN(recipeId)) {
      return NextResponse.json(
        { error: "Neveljaven ID." },
        { status: 400 }
      );
    }

    // ✅ cookies() JE ASYNC v Next 16
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken");

    if (!token) {
      return NextResponse.json(
        { error: "Niste prijavljeni." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET!
    ) as { id: number };

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recept ne obstaja." },
        { status: 404 }
      );
    }

    // 🔐 permission check
    if (recipe.userId !== decoded.id) {
      return NextResponse.json(
        { error: "Nimaš dovoljenja za brisanje." },
        { status: 403 }
      );
    }

    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Napaka na strežniku." },
      { status: 500 }
    );
  }
}
