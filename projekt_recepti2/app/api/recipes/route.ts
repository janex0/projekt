import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies(); // <-- IMPORTANT
    const token = cookieStore.get("authToken");

    if (!token) {
      return NextResponse.json(
        { error: "Niste prijavljeni." },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const { title, ingredients, steps, imageUrl } = await request.json();

    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        steps,
        imageUrl,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Recept shranjen!", recipe },
      { status: 201 }
    );

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Napaka pri shranjevanju recepta." },
      { status: 500 }
    );
  }
}
