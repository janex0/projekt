import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  const recipeId = Number(id);
  const userId = Number(session.user.id);

  if (Number.isNaN(recipeId)) {
    return NextResponse.json({ error: "Neveljaven ID." }, { status: 400 });
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { userId: true },
  });

  if (!recipe) {
    return NextResponse.json({ error: "Recept ne obstaja." }, { status: 404 });
  }

  if (recipe.userId !== userId) {
    return NextResponse.json(
      { error: "Nimate dovoljenja za brisanje." },
      { status: 403 }
    );
  }

  await prisma.recipe.delete({
    where: { id: recipeId },
  });

  return NextResponse.json({ ok: true });
}
