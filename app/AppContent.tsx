"use client";

import { useAuth } from "./context/AuthContext";
import Spinner from "./components/Spinner";

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
