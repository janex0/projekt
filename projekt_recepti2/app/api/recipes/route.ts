import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Pravilno branje tokena iz HTTP-only cookiejev
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Niste prijavljeni." },
        { status: 401 }
      );
    }

    // Dekodiranje tokena
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    // Preberemo podatke iz body
    const { title, ingredients, steps, imageUrl } = await request.json();

    // Shranimo recept
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
