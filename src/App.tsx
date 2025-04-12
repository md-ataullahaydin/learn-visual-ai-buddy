
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import AIAssistant from "./pages/AIAssistant";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import PendingApproval from "./pages/PendingApproval";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            
            {/* Protected Routes - Require Authentication and Approval */}
            <Route element={<ProtectedRoute requireApproval={true} />}>
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/subjects"
                element={
                  <MainLayout>
                    <Subjects />
                  </MainLayout>
                }
              />
              <Route
                path="/subjects/:id"
                element={
                  <MainLayout>
                    <SubjectDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/chat"
                element={
                  <MainLayout>
                    <AIAssistant />
                  </MainLayout>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <MainLayout>
                    <Onboarding />
                  </MainLayout>
                }
              />
              <Route
                path="/admin"
                element={
                  <MainLayout>
                    <Admin />
                  </MainLayout>
                }
              />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
