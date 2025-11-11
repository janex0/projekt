'use client';

export default function Home() {
  const recipes = [
    {
      id: 1,
      title: 'Palačinke s čokolado ',
      description: 'Mehke, slastne palačinke s topljeno čokolado in jagodami.',
      image: 'https://images.unsplash.com/photo-1589308078054-8329f3c6b3cc?w=800',
    },
    {
      id: 2,
      title: 'Domača pica ',
      description: 'Hrusta testo, paradižnikova omaka in ogromno sira!',
      image: 'https://images.unsplash.com/photo-1601924928585-3ec4e6b9fd53?w=800',
    },
    {
      id: 3,
      title: 'Špageti carbonara ',
      description: 'Klasična italijanska jed s panceto in parmezanom.',
      image: 'https://images.unsplash.com/photo-1589307000291-17e8459a8c23?w=800',
    },
  ];

  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-orange-700">Najbolj priljubljeni recepti</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
            <img src={recipe.image} alt={recipe.title} className="h-48 w-full object-cover" />
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-orange-600">{recipe.title}</h2>
              <p className="text-gray-600 mt-2">{recipe.description}</p>
            </div>
          </div>
        ))}
      </div>

      
    </main>
  );
}
