import { AppShell } from "@/components/layout/shell";
import { Route, Switch, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { ErrorBoundary } from "@/components/common/error-boundary";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Dashboard from "@/pages/dashboard";
import Events from "@/pages/events/index";
import EventDetail from "@/pages/events/detail";
import Clubs from "@/pages/clubs/index";
import ClubDetail from "@/pages/clubs/detail";
import Recruitments from "@/pages/recruitments";
import News from "@/pages/news/index";
import Calendar from "@/pages/calendar";
import CampusMap from "@/pages/map";
import NewsDetail from "@/pages/news/detail";
import Leaderboard from "@/pages/leaderboard";
import Profile from "@/pages/profile";
import Certificates from "@/pages/certificates";
import CertificateVerify from "@/pages/certificate-verify";
import Notifications from "@/pages/notifications";
import Search from "@/pages/search";
import CoordinatorHub from "@/pages/coordinator/index";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
    },
  },
});

function PageWrapper({ component: Component, ...rest }: any) {
  return (
    <AppShell>
      <Component {...rest} />
    </AppShell>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      <Route path="/dashboard"><PageWrapper component={Dashboard} /></Route>
      <Route path="/admin"><PageWrapper component={Dashboard} /></Route>
      <Route path="/events"><PageWrapper component={Events} /></Route>
      <Route path="/events/:id"><PageWrapper component={EventDetail} /></Route>
      <Route path="/calendar"><PageWrapper component={Calendar} /></Route>
      <Route path="/map"><PageWrapper component={CampusMap} /></Route>
      <Route path="/clubs"><PageWrapper component={Clubs} /></Route>
      <Route path="/clubs/:id"><PageWrapper component={ClubDetail} /></Route>
      <Route path="/recruitments"><PageWrapper component={Recruitments} /></Route>
      <Route path="/news"><PageWrapper component={News} /></Route>
      <Route path="/news/:id"><PageWrapper component={NewsDetail} /></Route>
      <Route path="/leaderboard"><PageWrapper component={Leaderboard} /></Route>
      <Route path="/profile"><PageWrapper component={Profile} /></Route>
      <Route path="/certificates"><PageWrapper component={Certificates} /></Route>
      <Route path="/certificates/verify/:code" component={CertificateVerify} />
      <Route path="/notifications"><PageWrapper component={Notifications} /></Route>
      <Route path="/search"><PageWrapper component={Search} /></Route>
      <Route path="/coordinator"><PageWrapper component={CoordinatorHub} /></Route>
      <Route path="/coordinator/:rest*"><PageWrapper component={CoordinatorHub} /></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WouterRouter>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
