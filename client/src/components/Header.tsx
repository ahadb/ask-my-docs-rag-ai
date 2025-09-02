import { Bars3Icon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  onNavigateHome?: () => void;
}

export default function Header({
  setSidebarOpen,
  onNavigateHome,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-x-3 border-b border-gray-200 bg-white px-3 shadow-sm sm:gap-x-4 sm:px-4 lg:px-6">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-5 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-x-4">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </button>
            )}
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* User Profile Section */}
            <div className="flex items-center gap-x-3">
              <div className="flex items-center gap-x-2">
                <UserCircleIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Demo User</span>
              </div>
              <button
                onClick={() => {
                  // Handle logout logic here
                  console.log('Logout clicked');
                  // You can add navigation to login page or clear auth state
                }}
                className="inline-flex items-center gap-x-2 rounded-md bg-gray-100 px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
