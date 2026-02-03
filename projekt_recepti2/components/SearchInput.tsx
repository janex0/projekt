interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Komponenta za iskalno polje z oranžno tematiko
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "🔍 Išči recepte..."
}: SearchInputProps) {
  return (
    <div className="flex justify-center">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full max-w-xl
          p-4
          border-2 border-orange-500
          rounded-full
          text-lg
          focus:outline-none
          focus:ring-2
          focus:ring-orange-400
        "
      />
    </div>
  );
}