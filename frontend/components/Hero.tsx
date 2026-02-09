import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-gray-100 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-400 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-widest">
                Coming Soon
              </span>
              <Sparkles className="w-5 h-5" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
              The Cinema Industry
              <span className="block bg-linear-to-r from-primary via-orange-400 to-red-400 bg-clip-text text-transparent mt-2">
                Network Awaits
              </span>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Connect with filmmakers, cinematographers, producers, directors,
              and creative professionals from around the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
