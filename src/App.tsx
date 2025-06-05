import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Calendar from "@/pages/calendar";
import Leads from "@/pages/leads";
import SalesPipeline from "@/pages/sales-pipeline";
import Orders from "@/pages/orders";
import Customers from "@/pages/customers";
import Tasks from "@/pages/tasks";
import Products from "@/pages/products";
import Reports from "@/pages/reports";
import KPIs from "@/pages/kpis";
import Automation from "@/pages/automation";
import Employees from "@/pages/employees";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/main-layout";

// Protected Route Component với permissions checking
function ProtectedRoute({ component: Component, requiredPermission }: { 
  component: React.ComponentType; 
  requiredPermission?: (permissions: any) => boolean;
}) {
  const { permissions } = usePermissions();
  
  if (requiredPermission && !requiredPermission(permissions)) {
    return <NotFound />;
  }
  
  return <Component />;
}

function Router() {
  // Bypass authentication - go directly to main app
  const isAuthenticated = true;

  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        
        <Route path="/calendar">
          <ProtectedRoute 
            component={Calendar}
            requiredPermission={(p) => p.canViewPersonalCalendar || p.canViewTeamCalendar || p.canViewAllCalendar}
          />
        </Route>
        
        <Route path="/leads">
          <ProtectedRoute 
            component={Leads}
            requiredPermission={(p) => p.canViewPersonalLeads || p.canViewTeamLeads || p.canViewAllLeads}
          />
        </Route>
        
        <Route path="/sales">
          <ProtectedRoute 
            component={SalesPipeline}
            requiredPermission={(p) => p.canViewPersonalLeads || p.canViewTeamLeads || p.canViewAllLeads}
          />
        </Route>
        
        <Route path="/orders">
          <ProtectedRoute 
            component={Orders}
            requiredPermission={(p) => p.canViewPersonalOrders || p.canViewTeamOrders || p.canViewAllOrders}
          />
        </Route>
        
        <Route path="/customers">
          <ProtectedRoute 
            component={Customers}
            requiredPermission={(p) => p.canViewPersonalCustomers || p.canViewTeamCustomers || p.canViewAllCustomers}
          />
        </Route>
        
        <Route path="/tasks">
          <ProtectedRoute 
            component={Tasks}
            requiredPermission={(p) => p.canViewPersonalTasks || p.canViewTeamTasks || p.canViewAllTasks}
          />
        </Route>
        
        <Route path="/products">
          <ProtectedRoute 
            component={Products}
            requiredPermission={(p) => p.canEditProducts}
          />
        </Route>
        
        <Route path="/reports">
          <ProtectedRoute 
            component={Reports}
            requiredPermission={(p) => p.canViewPersonalReports || p.canViewTeamReports || p.canViewAllReports}
          />
        </Route>
        
        <Route path="/kpis">
          <ProtectedRoute 
            component={KPIs}
            requiredPermission={(p) => p.canViewTeamKPIs || p.canViewAllKPIs}
          />
        </Route>
        
        <Route path="/automation">
          <ProtectedRoute 
            component={Automation}
            requiredPermission={(p) => p.canManageAutomation}
          />
        </Route>
        
        <Route path="/employees">
          <ProtectedRoute 
            component={Employees}
            requiredPermission={(p) => p.canViewTeamEmployees || p.canViewAllEmployees}
          />
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;