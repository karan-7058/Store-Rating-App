import { createBrowserRouter } from "react-router-dom"; 
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import OwnerRoute from "../components/OwnerRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import StoreDetails from "../pages/StoreDetails";

import AdminDashboard from "../pages/AdminDashboard";
import AdminStores from "../pages/AdminStores";
import AdminUsers from "../pages/AdminUsers";

import OwnerDashboard from "../pages/OwnerDashboard";
import OwnerStores from "../pages/OwnerStores";
import OwnerStoreRatings from "../pages/OwnerStoreRatings";

const MainRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/stores/:id",
        element: (
          <ProtectedRoute>
            <StoreDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // -------------------------------
  // ADMIN ROUTES
  // -------------------------------
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "/admin", element: <AdminDashboard /> },
     { path: "/admin/stores", element: <AdminStores /> },
     { path: "/admin/users", element: <AdminUsers /> },

    ],
  },

  // -------------------------------
  // STORE OWNER ROUTES
  // -------------------------------
  {
    path: "/owner",
    element: (
      <OwnerRoute>
        <OwnerLayout />
      </OwnerRoute>
    ),
    children: [
      { path: "/owner", element: <OwnerDashboard /> },
      { path: "/owner/stores", element: <OwnerStores /> },
      { path: "/owner/stores/:id/ratings", element: <OwnerStoreRatings /> },
    ],
  },
]);

export default MainRouter;
