import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUser() {
  const cookieStore = await cookies(); // ⬅️ zdaj je await!
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
      role: string;
    };

    return decoded;
  } catch {
    return null;
  }
}
