import { AppShell } from '@/components/layout/shell';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Landing from '@/pages/landing';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import Dashboard from '@/pages/dashboard';
import Events from '@/pages/events/index';
import EventDetail from '@/pages/events/detail';
import Clubs from '@/pages/clubs/index';
import ClubDetail from '@/pages/clubs/detail';
import Recruitments from '@/pages/recruitments';
import News from '@/pages/news/index';
import Calendar from '@/pages/calendar';
import CampusMap from '@/pages/map';
import NewsDetail from '@/pages/news/detail';
import Leaderboard from '@/pages/leaderboard';
import Profile from '@/pages/profile';
import Certificates from '@/pages/certificates';
import CertificateVerify from '@/pages/certificate-verify';
import Notifications from '@/pages/notifications';
import Search from '@/pages/search';
import { Component, ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background text-foreground space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
            C360
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Something went wrong</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            An unexpected error occurred while rendering this page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
            className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
          >
            Reload Campus 360
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
        404
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md">The page or module you are looking for is currently unavailable or doesn't exist.</p>
      <a href="/" className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-xs">
        Go Back Home
      </a>
    </div>
  )
}

function PageWrapper({ component: Component, ...rest }: any) {
  return (
    <AppShell>
      <Component {...rest} />
    </AppShell>
  )
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route path="/dashboard"><PageWrapper component={Dashboard} /></Route>
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
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
