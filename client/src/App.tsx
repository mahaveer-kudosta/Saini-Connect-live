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
import Header from "@/components/layout/Header";
import MobileNavigation from "@/components/layout/MobileNavigation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/members" component={Members} />
      <Route path="/events" component={Events} />
      <Route path="/groups" component={Groups} />
      <Route path="/profile" component={Profile} />
      <Route path="/guidelines" component={Guidelines} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;
