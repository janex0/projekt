import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken");

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
    }

    const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const formData = await request.formData();

    const title = String(formData.get("title"));
    const ingredients = String(formData.get("ingredients"));
    const steps = String(formData.get("steps"));

    if (!title || !ingredients || !steps) {
      return NextResponse.json(
        { error: "Vsa polja so obvezna." },
        { status: 400 }
      );
    }

    let imageUrl = formData.get("imageUrl") as string | null;
    const image = formData.get("image") as File | null;

    if (image && image.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { error: "Dovoljene so samo slike (jpg, png, webp)." },
          { status: 400 }
        );
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${image.name}`;
      const uploadPath = path.join(uploadDir, fileName);
      fs.writeFileSync(uploadPath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        steps,
        imageUrl,
        userId,
      },
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Napaka na strežniku." }, { status: 500 });
  }
}
