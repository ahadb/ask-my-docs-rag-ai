import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "../utils/auth";
import {
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface HomePageProps {
  onLogin: (success: boolean) => void;
  isAuthenticated: boolean;
}

export default function HomePage({
  onLogin,
  isAuthenticated,
}: HomePageProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAuthToken();
    onLogin(false);
  };

  const handleNavigateToDashboard = () => {
    if (isAuthenticated) {
      navigate("/demo");
    }
  };

  return (
    <div className="relative isolate overflow-hidden" style={{ backgroundColor: '#f7f6f4' }}>
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200 dark:stroke-white/10"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="#D9664A" fillOpacity="0.05" />
          </pattern>
        </defs>
        {/* <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg> */}
        {/* <rect fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" width="100%" height="100%" strokeWidth={0} /> */}
      </svg>
      <div
        aria-hidden="true"
        className="absolute top-10 left-0 -z-10 transform-gpu blur-3xl sm:left-0 lg:top-[calc(50%-30rem)] lg:left-0 xl:left-0"
        style={{ 
          width: '100%',
          height: '100%',
          maxWidth: '100vw',
          maxHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}
          className="aspect-1108/632 w-277 bg-linear-to-r from-[#D9664A] to-[#B85450] opacity-20"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 xl:flex xl:px-8 xl:py-40">
        <div className="mx-auto max-w-2xl shrink-0 xl:mx-0 xl:pt-8">
         
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span 
                className="rounded-full px-3 py-1 text-sm/6 font-semibold ring-1 ring-inset"
                style={{ 
                  backgroundColor: '#e9e7e3', 
                  color: '#D9664A', 
                  border: '1px solid #D9664A' 
                }}
              >
                AI-Powered
              </span>
      
            </a>
          </div>
          <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">
            Supercharge your Documents with AI
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Transform any document into an intelligent AI assistant. Upload your docs and ask questions in plain English. Get intelligent, AI-powered answers with source citations from your own knowledge base.
          </p>
                     <div className="mt-10 flex items-center gap-x-6">
             {isAuthenticated ? (
               <button
                 onClick={handleNavigateToDashboard}
                 className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
                 style={{ 
                   backgroundColor: '#e9e7e3', 
                   color: '#D9664A', 
                   border: '1px solid #D9664A' 
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = '#e9e7e3';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = '#e9e7e3';
                 }}
               >
                 Go to Dashboard
               </button>
             ) : (
               <>
                 <button
                   onClick={() => navigate("/signin")}
                   className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
                   style={{ 
                     backgroundColor: '#e9e7e3', 
                     color: '#D9664A', 
                     border: '1px solid #D9664A' 
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.backgroundColor = '#e9e7e3';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.backgroundColor = '#e9e7e3';
                   }}
                 >
                   Sign In
                 </button>
                 <button
                   onClick={() => navigate("/signup")}
                   className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
                   style={{ 
                     backgroundColor: '#e9e7e3', 
                     color: '#D9664A', 
                     border: '1px solid #D9664A' 
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.backgroundColor = '#e9e7e3';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.backgroundColor = '#e9e7e3';
                   }}
                 >
                   Sign Up
                 </button>
               </>
             )}
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 xl:mt-0 xl:mr-0 xl:ml-10 xl:max-w-none xl:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl xl:max-w-none">
            <img
              alt="App screenshot"
              src="app-screenshot.png"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10 dark:hidden"
            />
            <img
              alt="App screenshot"
              src="app-screenshot.png"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 not-dark:hidden"
            />
          </div>
        </div>
      </div>

      {/* Login Link - Top Right */}
      <div className="absolute top-6 right-6 z-10 relative">
        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 text-sm">
              Welcome, demo!
            </span>
            <button
              onClick={handleNavigateToDashboard}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              style={{ 
                backgroundColor: '#e9e7e3', 
                color: '#D9664A', 
                border: '1px solid #D9664A' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9e7e3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e9e7e3';
              }}
            >
              Dashboard
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              style={{ 
                backgroundColor: '#e9e7e3', 
                color: '#D9664A', 
                border: '1px solid #D9664A' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9e7e3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e9e7e3';
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate("/signin")}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: '#D9664A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#D9664A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D9664A';
              }}
            >
              Sign in →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
