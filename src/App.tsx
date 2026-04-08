import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import LanguageScreen from './screens/LanguageScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import SchemeDetailsScreen from './screens/SchemeDetailsScreen';
import ChatScreen from './screens/ChatScreen';
import TrackerScreen from './screens/TrackerScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReportGeneratorScreen from './screens/ReportGeneratorScreen';
import ApplicationScreen from './screens/ApplicationScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import Layout from './components/Layout';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-primary mb-4">Something went wrong</h2>
            <p className="text-on-surface-variant mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold"
            >
              Refresh App
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-surface-container-highest rounded-lg text-left text-xs overflow-auto max-h-48">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { LanguageProvider } from './LanguageContext';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/auth" element={<AuthScreen />} />
              <Route path="/language" element={<LanguageScreen />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/discover" element={<DiscoverScreen />} />
              <Route path="/scheme/:id" element={<SchemeDetailsScreen />} />
              <Route path="/assistant" element={<ChatScreen />} />
              <Route path="/tracker" element={<TrackerScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/report" element={<ReportGeneratorScreen />} />
              <Route path="/apply/:id" element={<ApplicationScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
