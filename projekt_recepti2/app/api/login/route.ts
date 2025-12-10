import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Preverimo, če uporabnik obstaja
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Napačen email ali geslo." },
        { status: 400 }
      );
    }

    // Preverimo geslo
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Napačen email ali geslo." },
        { status: 400 }
      );
    }

    // 🔥 Ustvarimo JWT token z vključenim ROLE
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,   // ⬅️⬅️⬅️ TUKAJ SMO DODALI ROLE
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // Pošljemo cookie nazaj
    const response = NextResponse.json(
      { message: "Prijava uspešna!" },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Napaka na strežniku" },
      { status: 500 }
    );
  }
}
