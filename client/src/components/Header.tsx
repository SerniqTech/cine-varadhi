import { Film, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";

export default function Header() {
  const { user, signOut } = useAuthStore();

  const fullName = user?.user_metadata?.full_name || "User";
  const email = user?.email;

  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((word: string) => word[0])
    .join("")
    .toUpperCase();


  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="bg-linear-to-br from-amber-500 to-orange-600 p-2 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Cine Varadhi
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col space-y-1">
                  <span className="font-medium">{fullName}</span>
                  <span className="text-xs text-muted-foreground">{email}</span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
