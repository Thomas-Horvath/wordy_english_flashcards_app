// components/Spinner.tsx
export default function Spinner() {
  return (
    <div className="flex justify-center items-center p-4 h-screen">
      <div className="w-20 h-20 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
