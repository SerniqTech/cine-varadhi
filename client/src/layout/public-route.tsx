import { Navigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthLoading, isProfileLoading } = useAuthStore();

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
