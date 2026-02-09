import { useRoutes } from "react-router";
import Hero from "./components/Hero";
import DashboardLayout from "./layout/dashboard-layout";
import { CreatorOnboardingForm } from "./components/creator-onboarding-form";

export const Router = () => {
  return useRoutes([
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <Hero />,
        },
      ],
    },
    {
      path: "new-account-registration",
      element: <CreatorOnboardingForm />,
    },
  ]);
};
