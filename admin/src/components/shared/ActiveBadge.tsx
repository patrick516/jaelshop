import { Badge } from "@/components/ui/badge";

// A green "Active" or grey "Hidden" pill
export default function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge variant="secondary" className={active ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-200 text-gray-700 hover:bg-gray-200"}>
      {active ? "Active" : "Hidden"}
    </Badge>
  );
}
