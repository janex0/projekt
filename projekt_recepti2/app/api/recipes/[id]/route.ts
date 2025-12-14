import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(params.id) },
  });

  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ❗ PERMISSIONS CHECK
  if (user.role !== "ADMIN" && recipe.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.recipe.delete({
    where: { id: recipe.id },
  });

  return NextResponse.json({ success: true });
}
