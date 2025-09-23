type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg shadow-lg text-white w-[90%] max-w-sm">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-neutral-600 hover:bg-neutral-500"
          >
            Mégse
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
          >
            Törlés
          </button>
        </div>
      </div>
    </div>
  );
}


export default ConfirmModal;