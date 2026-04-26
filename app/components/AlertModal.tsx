"use client";

import { useRouter } from "next/navigation";

type AlertModalProps = {
  open: boolean;
  title?: string;
  message: string;
  closeLabel?: string;
  closeHref?: string;
  onClose?: () => void;
};

export default function AlertModal({
  open,
  title = "Hiba történt",
  message,
  closeLabel = "Bezárás",
  closeHref,
  onClose,
}: AlertModalProps) {
  const router = useRouter();

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose?.();

    if (closeHref) {
      router.push(closeHref);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-lg bg-neutral-800 p-6 text-white shadow-lg">
        <div className="rounded-lg border border-red-500 bg-red-500/10 px-4 py-4 text-red-200">
          <h2 className="mb-3 text-center text-2xl font-bold text-white">{title}</h2>
          <p className="text-center text-sm leading-6">{message}</p>
        </div>

        <button
          type="button"
          className="cursor-pointer mt-5 w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500"
          onClick={handleClose}
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
