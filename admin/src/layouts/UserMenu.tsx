import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/useAuth";

// Name, role and the Log out menu in the top right
export default function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const initials = user.firstName.charAt(0) + user.lastName.charAt(0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar>
          {user.avatarUrl && (
            <AvatarImage src={user.avatarUrl} alt="" className="object-cover" />
          )}
          <AvatarFallback className="bg-orange-500 font-bold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-sm font-bold text-navy">
            {user.firstName} {user.lastName}
          </span>
          <span className="block text-xs text-muted-foreground">
            {user.role}
          </span>
        </span>
        <ChevronDown
          size={16}
          className="hidden text-muted-foreground md:block"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive">
          <LogOut size={16} className="mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
