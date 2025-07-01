export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-r-green-500 border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-green-500/40"></div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-green-600 dark:text-green-400 animate-pulse">
        Loading GREAN Energy Systems...
      </p>
    </div>
  );
} 