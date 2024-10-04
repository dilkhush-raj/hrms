import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Spinner from "./components/Spinner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="center h-screen">
        <p>You are not authenticated. Please</p> <Link to="/login">Login</Link>
      </div>
    );
  }

  if (user?.role !== "hr" && user?.role !== "admin") {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <div className="center h-screen">
              <p>You are not authorized to view this page.</p>
            </div>
          }
        />
      </Routes>
    );
  }

  // Allow access to all routes if user is "hr" or "admin"
  return children;
};

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="poppins-regular">
      <Sidebar toggleSidebar={() => setOpen(!open)} isOpen={open} />
      <div className="layout">
        <Navbar toggleSidebar={() => setOpen(!open)} />
        <Outlet />
      </div>
    </div>
  );
};

const ProtectedRoutes = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </ProtectedRoute>
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
