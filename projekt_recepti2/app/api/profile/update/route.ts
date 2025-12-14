import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, password } = await req.json();

  const data: any = {};
  if (name) data.name = name;
  if (password) data.password = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data,
  });

  return NextResponse.json({ success: true });
}
