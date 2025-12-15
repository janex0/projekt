import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
      <ul className="flex gap-6 justify-center text-lg font-semibold text-white">
        <li><Link href="/">Domov</Link></li>
        <li><Link href="/add">Dodaj recept</Link></li>

        {!user && (
          <>
            <li><Link href="/login">Prijava</Link></li>
            <li><Link href="/signup">Registracija</Link></li>
          </>
        )}

        {user && (
          <>
            <li><Link href="/profile">Profil</Link></li>
            <li><Link href="/api/auth/signout">Odjava</Link></li>
          </>
        )}

        {user?.role === "ADMIN" && (
          <li><Link href="/admin/dashboard">Admin</Link></li>
        )}
      </ul>
    </nav>
  );
}
