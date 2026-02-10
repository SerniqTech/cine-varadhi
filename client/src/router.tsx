import { useRoutes } from "react-router";
import Hero from "./components/hero";
import DashboardLayout from "./layout/dashboard-layout";
import CreatorOnboardingForm from "./pages/creator-onboarding-form";
import { Login } from "./pages/login";
import ProtectedRoute from "./layout/protected-route";
import PublicRoute from "./layout/public-route";

export const Router = () => {
  return useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Hero />,
        },
      ],
    },
    {
      path: "new-account-registration",
      element: (
        <ProtectedRoute allowIncompleteOnboarding>
          <CreatorOnboardingForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
  ]);
};
