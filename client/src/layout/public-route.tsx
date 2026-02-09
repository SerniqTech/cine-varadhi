import { Navigate } from "react-router";
import { useAuth } from "@/context/use-auth";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking session...</p>
      </div>
    );

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
