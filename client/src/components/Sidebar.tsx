import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  XMarkIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  EllipsisHorizontalIcon,
  StarIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { clearAuthToken } from "../utils/auth";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout?: () => void;
  recentChats?: Array<{ id: string; title: string; confidence?: 'high' | 'medium' | 'low' }>;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  recentChats = [],
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openChatMenu, setOpenChatMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: DocumentTextIcon },
    { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
  ];

  // Recent chats data comes from props (starts empty)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenChatMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center">
                      <h1 className="text-xl font-bold text-gray-900">DocChat <span className="text-sm font-normal text-gray-500">(Beta)</span></h1>
                    </div>
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
                                    ? "bg-gray-200 text-indigo-600"
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-70 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-300 px-6 pb-4" style={{ backgroundColor: '#f0efec' }}>
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">DocChat <span className="text-sm font-normal text-gray-500">(Beta)</span></h1>
            </div>
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
                            ? ""
                            : "hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-base font-semibold w-full text-left cursor-pointer"
                        )}
                        style={{
                          backgroundColor: isCurrentPage(item.href) ? '#e9e7e3' : 'transparent',
                          color: isCurrentPage(item.href) ? '#D9664A' : '#4A4A4A'
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrentPage(item.href)) {
                            e.currentTarget.style.color = '#D9664A';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrentPage(item.href)) {
                            e.currentTarget.style.color = '#4A4A4A';
                          }
                        }}
                      >
                        <item.icon
                          className="h-6 w-5 shrink-0"
                          style={{
                            color: isCurrentPage(item.href) ? '#D9664A' : '#4A4A4A'
                          }}
                          aria-hidden="true"
                        />
                        {item.name}
                      </button>
                      {/* Add divider before Settings */}
                      {index === 1 && (
                        <div className="mx-2 my-2 border-t border-gray-200" />
                      )}
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* Recent Chats Section */}
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-500 mb-2 text-left">Recent Chats</div>
                <ul role="list" className="-mx-2 space-y-0">
                  {recentChats.map((chat) => (
                    <li key={chat.id} className="relative">
                      <div className="group flex items-center justify-between rounded-md p-1 text-sm hover:bg-gray-50">
                        <button className="flex-1 min-w-0 text-left">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-700 truncate">{chat.title}</p>
                            {chat.confidence && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                chat.confidence === 'high' 
                                  ? 'bg-green-100 text-green-800' 
                                  : chat.confidence === 'medium' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {chat.confidence}
                              </span>
                            )}
                          </div>
                        </button>
                        
                        <div className="relative" ref={openChatMenu === chat.id ? menuRef : null}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenChatMenu(openChatMenu === chat.id ? null : chat.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </button>
                          
                          {/* Flyout Menu */}
                          {openChatMenu === chat.id && (
                            <div className="absolute right-0 top-8 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                  <StarIcon className="h-4 w-4 mr-2" />
                                  Star
                                </button>
                                <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                  <PencilIcon className="h-4 w-4 mr-2" />
                                  Rename
                                </button>
                                <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                  <TrashIcon className="h-4 w-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              
              <li className="mt-auto">
                <button
                  onClick={() => {
                    clearAuthToken();
                    if (onLogout) {
                      onLogout();
                    }
                  }}
                  className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold w-full text-left text-gray-700 hover:bg-gray-50 hover:text-red-600"
                >
                  <ArrowRightOnRectangleIcon
                    className="h-6 w-5 shrink-0 text-gray-400 group-hover:text-red-600"
                    aria-hidden="true"
                  />
                  Logout
                </button>
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
