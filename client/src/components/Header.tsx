import { Bars3Icon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  onNavigateHome?: () => void;
}

export default function Header({
  setSidebarOpen,
  onNavigateHome,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-x-4">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </button>
            )}
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Add any additional header elements here */}
          </div>
        </div>
      </div>
    </div>
  );
}
