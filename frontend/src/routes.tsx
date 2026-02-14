import { createBrowserRouter } from "react-router";
import RootLayout from "./components/layouts/RootLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import AppLayout from "./components/layouts/AppLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// App Pages
import AppIndexPage from "./pages/app/IndexPage";
import AppSubjectsPage from "./pages/app/subjects/SubjectsPage";
import AppSubjectDetailPage from "./pages/app/subjects/SubjectDetailPage";
import AppSubjectMaterialPage from "./pages/app/subjects/SubjectMaterialPage";
import AppProfilePage from "./pages/app/profile/ProfilePage";

// Dashboard Pages
import DashboardIndexPage from "./pages/dashboard/IndexPage";
import DashboardSubjectsPage from "./pages/dashboard/subjects/SubjectsPage";
import DashboardMaterialsPage from "./pages/dashboard/subjects/materials/MaterialsPage";
import DashboardQuizzesPage from "./pages/dashboard/subjects/quizzes/QuizzesPage";
import StudentsPage from "./pages/dashboard/students/StudentsPage";
import SettingsPage from "./pages/dashboard/settings/SettingsPage";

import { AuthProvider } from "./context/AuthContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    ),
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: "login", element: <LoginPage /> },
              { path: "register", element: <RegisterPage /> },
            ],
          },
        ],
      },

      {
        path: "/",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AppIndexPage /> },
          { path: "subjects", element: <AppSubjectsPage /> },
          { path: "subjects/:slug", element: <AppSubjectDetailPage /> },
          { path: "profile", element: <AppProfilePage /> },
        ],
      },
      {
        path: "subjects/:slug/material/:materialId",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <AppSubjectMaterialPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardIndexPage /> },
          { path: "subjects", element: <DashboardSubjectsPage /> },
          {
            path: "subjects/:slug/materials",
            element: <DashboardMaterialsPage />,
          },
          {
            path: "subjects/:slug/materials/:materialSlug/quizzes",
            element: <DashboardQuizzesPage />,
          },
          { path: "students", element: <StudentsPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
