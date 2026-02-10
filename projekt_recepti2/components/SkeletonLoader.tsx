interface SkeletonLoaderProps {
  count?: number;
}

/**
 * Komponenta za prikaz loading skeleton-a med nalaganjem podatkov
 * Prikazuje animirane placeholder kartice
 */
export default function SkeletonLoader({ count = 6 }: SkeletonLoaderProps) {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-10">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white rounded-2xl border p-6 space-y-4"
        >
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}