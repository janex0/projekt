import { ReactNode } from "react";

/**
 * Oznaci iskan niz v besedilu z <mark> elementom
 * @param text - Originalno besedilo
 * @param query - Iskani niz
 * @returns ReactNode z označenimi deli
 */
export function highlight(text: string, query: string): ReactNode {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="bg-orange-200 text-black px-1 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}