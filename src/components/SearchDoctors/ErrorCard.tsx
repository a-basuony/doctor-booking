import { AlertCircle } from "lucide-react";

export const ErrorMessage: React.FC<{
  message?: string;
  retry?: () => void;
}> = ({ message, retry }) => (
  <div className="col-span-full flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl border border-red-200">
    <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
    <p className="text-red-600 font-medium text-center">{message}</p>
    {retry && (
      <button
        onClick={retry}
        className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
      >
        Retry
      </button>
    )}
  </div>
);
