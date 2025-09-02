import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  XMarkIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Dashboard", href: "/dashboard", icon: DocumentTextIcon },
    { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setSidebarOpen(false);
  };

  const isCurrentPage = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component for mobile */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-600 rounded-lg">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Document base */}
                          <path d="M7 2C6.44772 2 6 2.44772 6 3V21C6 21.5523 6.44772 22 7 22H17C17.5523 22 18 21.5523 18 21V9L13 4H7Z" fill="currentColor" fillOpacity="0.9"/>
                          {/* Document fold */}
                          <path d="M13 4V9H18L13 4Z" fill="currentColor" fillOpacity="0.7"/>
                          {/* AI brain/neural network nodes */}
                          <circle cx="9" cy="12" r="1" fill="white" fillOpacity="0.8"/>
                          <circle cx="15" cy="12" r="1" fill="white" fillOpacity="0.8"/>
                          <circle cx="12" cy="15" r="1" fill="white" fillOpacity="0.8"/>
                          <circle cx="12" cy="9" r="1" fill="white" fillOpacity="0.8"/>
                          {/* Neural connections */}
                          <path d="M9 12L12 9M12 9L15 12M12 9L12 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                          {/* Search/magnifying glass */}
                          <circle cx="16" cy="16" r="2" stroke="white" strokeWidth="1.5" fill="none"/>
                          <path d="M18 18L20 20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="6" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="18" r="2" />
                      </svg>
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item, index) => (
                            <li key={item.name}>
                              <button
                                onClick={() => handleNavigation(item.href)}
                                className={classNames(
                                  isCurrentPage(item.href)
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold w-full text-left cursor-pointer"
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    isCurrentPage(item.href)
                                      ? "text-indigo-600"
                                      : "text-gray-400 group-hover:text-indigo-600",
                                    "h-6 w-5 shrink-0"
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </button>
                              {/* Add divider between Dashboard and Settings */}
                              {index === 1 && (
                                <div className="mx-2 my-2 border-t border-gray-200" />
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Document base */}
                  <path d="M7 2C6.44772 2 6 2.44772 6 3V21C6 21.5523 6.44772 22 7 22H17C17.5523 22 18 21.5523 18 21V9L13 4H7Z" fill="currentColor" fillOpacity="0.9"/>
                  {/* Document fold */}
                  <path d="M13 4V9H18L13 4Z" fill="currentColor" fillOpacity="0.7"/>
                  {/* AI brain/neural network nodes */}
                  <circle cx="9" cy="12" r="1" fill="white" fillOpacity="0.8"/>
                  <circle cx="15" cy="12" r="1" fill="white" fillOpacity="0.8"/>
                  <circle cx="12" cy="15" r="1" fill="white" fillOpacity="0.8"/>
                  <circle cx="12" cy="9" r="1" fill="white" fillOpacity="0.8"/>
                  {/* Neural connections */}
                  <path d="M9 12L12 9M12 9L15 12M12 9L12 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                  {/* Search/magnifying glass */}
                  <circle cx="16" cy="16" r="2" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M18 18L20 20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="6" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="18" r="2" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item, index) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={classNames(
                          isCurrentPage(item.href)
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold w-full text-left cursor-pointer"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            isCurrentPage(item.href)
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600",
                            "h-6 w-5 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </button>
                      {/* Add divider between Dashboard and Settings */}
                      {index === 1 && (
                        <div className="mx-2 my-2 border-t border-gray-200" />
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
