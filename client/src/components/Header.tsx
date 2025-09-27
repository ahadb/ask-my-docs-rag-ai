import { Bars3Icon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon, ChevronDownIcon, Cog6ToothIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { clearAuthToken } from "../utils/auth";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  onNavigateHome?: () => void;
  onLogout?: () => void;
  user?: { id: string; email: string; full_name: string } | null;
  showDemoModal: boolean;
  setShowDemoModal: (show: boolean) => void;
}

export default function Header({
  setSidebarOpen,
  onNavigateHome,
  onLogout,
  user,

}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Generate avatar color based on user name
  // const getAvatarColor = (name: string) => {
  //   const colors = [
  //     'bg-indigo-600',
  //     'bg-purple-600', 
  //     'bg-pink-600',
  //     'bg-red-600',
  //     'bg-orange-600',
  //     'bg-yellow-600',
  //     'bg-green-600',
  //     'bg-teal-600',
  //     'bg-cyan-600',
  //     'bg-blue-600'
  //   ];
  //   const hash = name.split('').reduce((a, b) => {
  //     a = ((a << 5) - a) + b.charCodeAt(0);
  //     return a & a;
  //   }, 0);
  //   return colors[Math.abs(hash) % colors.length];
  // };

  // Get user initials
  const getUserInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'D';
  };

  // const avatarColor = '';

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-x-3 border-b border-gray-200 px-3 shadow-sm sm:gap-x-4 sm:px-4 lg:px-6 lg:pl-72" style={{ backgroundColor: '#f0efec' }}>
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
        {/* Breadcrumb - Far Left */}
        <div className="flex items-center">
          <BuildingOfficeIcon className="h-4 w-4 text-gray-600 ml-2 mr-2" />
          <button
            onClick={() => navigate('/settings')}
            className="text-sm hover:underline transition-colors"
            style={{ color: '#D9664A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#B85450';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#D9664A';
            }}
          >
            Demo Org
          </button>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm text-gray-900 font-medium">
            Dashboard
          </span>
        </div>
        
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-x-4">
            {onNavigateHome && (
              <></>
            )}
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
              >
                {/* Avatar */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 text-sm font-medium" style={{ backgroundColor: '#e9e7e3' }}>
                  {getUserInitials()}
                </div>
                <span className="max-w-[120px] truncate">
                  {user?.full_name || user?.email || "Demo User"}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-x-3">
                      {/* Avatar in dropdown */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 text-sm font-medium" style={{ backgroundColor: '#e9e7e3' }}>
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.full_name || "Demo User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email || "demo@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    >
                      <Cog6ToothIcon className="h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate("/demo");
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    >
                      <HomeIcon className="h-4 w-4" />
                      Dashboard
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        clearAuthToken();
                        if (onLogout) {
                          onLogout();
                        }
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
