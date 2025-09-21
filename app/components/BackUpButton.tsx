"use client";
import { useState } from "react";

export default function BackupButton() {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/backup");
      if (!res.ok) throw new Error("Backup failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // trigger letöltés
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${Date.now()}.db`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Hiba történt a mentés során: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBackup}
      disabled={loading}
      className=" cursor-pointer rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
    >
      {loading ? "Mentés készül..." : "📥 Adatbázis letöltése"}
    </button>
  );
}
