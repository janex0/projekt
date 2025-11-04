'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold">Recepti App</h1>
      <nav className="space-x-4">
        <Link href="/">Domov</Link>
        <Link href="/recipes">Recepti</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
  );
}
