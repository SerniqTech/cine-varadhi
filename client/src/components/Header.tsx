import { Film } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/use-auth";

export default function Header() {
  const { user } = useAuth();
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
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {(user?.user_metadata?.full_name || "")
                  ?.split(" ")
                  .slice(0, 2)
                  .map((word: string) => word[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </div>
    </header>
  );
}
