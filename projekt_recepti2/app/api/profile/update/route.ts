import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/authOptions";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // 🔐 NextAuth session
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name, password } = await req.json();

  const data: {
    name?: string;
    password?: string;
  } = {};

  if (name) data.name = name;
  if (password) data.password = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  return NextResponse.json({ success: true });
}
