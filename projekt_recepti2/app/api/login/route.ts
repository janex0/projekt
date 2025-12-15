import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Napačen email ali geslo." },
        { status: 400 }
      );
    }

    // 🚨 GOOGLE USER → nima gesla
    if (!user.password) {
      return NextResponse.json(
        { error: "Ta račun uporablja Google prijavo." },
        { status: 400 }
      );
    }

    // ✅ zdaj je password 100% string
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Napačen email ali geslo." },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ success: true });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Napaka na strežniku." },
      { status: 500 }
    );
  }
}
