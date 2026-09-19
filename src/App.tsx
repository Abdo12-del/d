import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Index from "@/pages/Index";
import Tasks from "@/pages/Tasks";
import Sessions from "@/pages/Sessions";
import Routine from "@/pages/Routine";
import Schedule from "@/pages/Schedule";
import Links from "@/pages/Links";
import Messages from "@/pages/Messages";
import Files from "@/pages/Files";
import Guide from "@/pages/Guide";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import Special from "@/pages/Special";
import Rules from "@/pages/Rules";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" richColors />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/links" element={<Links />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/files" element={<Files />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/special" element={<Special />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
