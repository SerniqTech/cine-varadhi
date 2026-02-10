import { Navigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";

export default function ProtectedRoute({
  children,
  allowIncompleteOnboarding,
}: {
  children: React.ReactNode;
  allowIncompleteOnboarding?: boolean;
}) {
  const { user, profile, isAuthLoading, isProfileLoading } = useAuthStore();

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowIncompleteOnboarding && !profile?.onboarding_completed) {
    return <Navigate to="/new-account-registration" replace />;
  }

  return <>{children}</>;
}
