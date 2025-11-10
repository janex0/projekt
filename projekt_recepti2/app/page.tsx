'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-red-100 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
        Dobrodošli v <span className="text-orange-600">Recepti App</span>! 🍲
      </h1>

      <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
        Tukaj lahko raziskuješ okusne recepte, dodajaš svoje,
        jih deliš z drugimi ter odkrivaš nove kuharske ideje.
      </p>

      <p className="mt-6 text-gray-500 text-sm">
        Uporabi navigacijo zgoraj za raziskovanje 👆
      </p>

      
    </main>
  );
}
