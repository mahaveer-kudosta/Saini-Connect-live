import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Members from "@/pages/members";
import Events from "@/pages/events";
import Groups from "@/pages/groups";
import Profile from "@/pages/profile";
import Guidelines from "@/pages/guidelines";
import AuthPage from "@/pages/auth-page";
import Header from "@/components/layout/Header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/members" component={Members} />
      <ProtectedRoute path="/events" component={Events} />
      <ProtectedRoute path="/groups" component={Groups} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/guidelines" component={Guidelines} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <main className="flex-1 overflow-auto pb-14 md:pb-0">
            <Router />
          </main>
          <MobileNavigation />
          <Toaster />
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
