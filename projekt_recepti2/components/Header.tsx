import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getUser(); // <-- DODANO

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
      <ul className="flex gap-6 justify-center text-lg font-semibold">

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
            <li><Link href="/logout">Odjava</Link></li>
          </>
        )}

        {user?.role === "ADMIN" && (
          <li><Link href="/admin/dashboard">Admin</Link></li>
        )}

      </ul>
    </nav>
  );
}
