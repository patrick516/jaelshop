import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = { initial: string; placeholder: string; onSearch: (term: string) => void };

// A search box that searches when Enter is pressed. Give it key={currentSearch} so it resets with the address
export default function SearchBox({ initial, placeholder, onSearch }: Props) {
  const [term, setTerm] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(term.trim());
      }}
      className="relative min-w-[220px] flex-1"
    >
      <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder={placeholder} className="pr-10" />
      <Search size={18} className="absolute right-3 top-2.5 text-muted-foreground" />
    </form>
  );
}
