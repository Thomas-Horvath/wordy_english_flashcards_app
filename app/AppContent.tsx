"use client";

import { useAuth } from "./context/AuthContext";
import Spinner from "./components/Spinner";

export default function AppContent({ children }: { children: React.ReactNode }) {
  // Az AppContent a teljes alkalmazás közös "kapuja":
  // itt döntjük el, hogy globális töltést mutassunk-e,
  // és itt jelenítünk meg központi auth hibajelzést is.
  const { loading, authError } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Ha az auth ellenőrzés átmenetileg meghiúsul, attól még nem dobjuk ki a felhasználót.
          Inkább egy diszkrét sávban jelezzük, hogy a session ellenőrzése most bizonytalan. */}
      {authError && (
        <div className="px-4 py-2 text-sm text-center bg-amber-600 text-white">
          {authError}
        </div>
      )}
      {children}
    </>
  );
}
