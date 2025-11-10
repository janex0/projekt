'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-extrabold tracking-wide mb-2 md:mb-0 hover:text-blue-300 transition">
           Recepti App
        </h1>

        <nav className="flex space-x-4 text-lg font-medium">
          <Link href="/" className="hover:text-yellow-300 transition">Domov</Link>
          <Link href="/recipes" className="hover:text-yellow-300 transition">Recepti</Link>
          <Link href="/login" className="hover:text-yellow-300 transition">Prijava</Link>
          <Link href="/signup" className="hover:text-yellow-300 transition">Registracija</Link>
          <Link href="/admin" className="hover:text-yellow-300 transition">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
