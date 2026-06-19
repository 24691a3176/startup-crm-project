// Import NavLink from react-router-dom to handle active-state navigation classes automatically
import { NavLink } from 'react-router-dom';
// Import Lucide React icons for highly polished visual navigation markers
import { LayoutDashboard, Users, BarChart3, X } from 'lucide-react';

// Define the Sidebar component representing our main dashboard navigation layout
export default function Sidebar({ isMobile, onClose }) {
  // Define navigation items configuration array containing paths, labels, and icons
  const navItems = [
    {
      // The destination path matching the router definitions
      path: '/',
      // Human-readable title of the navigation point
      label: 'Dashboard',
      // Dynamic rendering of the dashboard icon
      icon: LayoutDashboard,
    },
    {
      // The destination path for lead listing and detailed records
      path: '/leads',
      // Human-readable title of the navigation point
      label: 'Lead Management',
      // Dynamic rendering of the leads/users icon
      icon: Users,
    },
    {
      // The destination path for performance visualizations
      path: '/analytics',
      // Human-readable title of the navigation point
      label: 'Analytics',
      // Dynamic rendering of the chart/analytics icon
      icon: BarChart3,
    },
  ];

  return (
    // Outer sidebar container with white glassmorphism styling
    <aside className={`${isMobile ? 'w-full' : 'w-56 lg:w-64'} bg-white/8 dark:bg-gray-800/80 dark:bg-gray-800/90 backdrop-blur-xl border-r border-slate-200 dark:border-gray-700 min-h-screen flex flex-col justify-between p-4 lg:p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] shrink-0 z-50 relative transition-all duration-300`}>
      {/* Top section containing branding and main navigation items */}
      <div className="space-y-8">
        {/* Branding/Logo element of our CRM */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-3">
            {/* Decorative glowing gradient ring around the CRM icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              {/* White vector shape for the brand icon */}
              <span className="text-white font-roboto font-extrabold text-xl">S</span>
            </div>
            {/* Logo labels showing startup focus */}
            <div className={`flex flex-col`}>
              <h1 className="font-roboto font-bold text-[#2563EB] tracking-tight text-base leading-none">Startup CRM</h1>
              <span className={`text-[10px] font-roboto font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1 ${isMobile ? 'block' : 'hidden lg:block'}`}>Lite Edition</span>
            </div>
          </div>
          {isMobile && (
            <button onClick={onClose} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-gray-400 focus:outline-none">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Main navigation list */}
        <nav className="space-y-1.5">
          {/* Map through navigation items config to build matching NavLinks */}
          {navItems.map((item) => {
            // Grab the specific Icon component class from the config item 
            const Icon = item.icon;

            return (
              <NavLink
                // Key property for efficient virtual DOM list updates
                key={item.path}
                // Target URL defined in routing config
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                // Function checking if route is active to render dynamic Tailwind CSS classes
                className={({ isActive }) =>
                  `flex items-center space-x-3.5 ${isMobile ? 'px-4 py-3' : 'px-3 py-2 lg:px-4 lg:py-3'} rounded-xl transition-all duration-300 group ${isActive
                    // Styling for active state: blue gradient background, white text, glowing left border indicator
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-blue-500/25 font-semibold relative overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white dark:bg-gray-800 before:shadow-[0_0_10px_white]'
                    // Styling for inactive state: gray text and soft hovers
                    : 'text-[#64748B] dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700/50 hover:text-slate-900 dark:text-white dark:hover:text-white border-l-4 border-transparent'
                  }`
                }
              >
                {/* Dynamically rendered icon with active states hover animation scaling */}
                <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0" />
                {/* Text label for the navigation item */}
                <span className="font-roboto text-sm tracking-wide truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer of the sidebar for account information, settings and system info */}
      <div className="pt-6 border-t border-slate-100 dark:border-gray-700">

        {/* User Account block showing avatar and dynamic metadata */}
        <div className={`flex items-center justify-between p-2 lg:p-3 bg-slate-50 dark:bg-gray-700/50 rounded-[20px] border border-slate-100 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors cursor-pointer min-h-[44px]`}>
          <div className="flex items-center space-x-3 overflow-hidden">
            {/* Avatar image with status dot indicator */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-gray-600 dark:to-gray-500 flex items-center justify-center text-slate-700 dark:text-gray-200 font-bold text-sm shadow-sm border-2 border-white dark:border-gray-700">
                JD
              </div>
              {/* Green active status indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></span>
            </div>
            {/* Name and role labels */}
            <div className={`overflow-hidden`}>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Jane Doe</p>
              <p className={`text-[11px] font-semibold text-slate-500 dark:text-gray-400 truncate uppercase tracking-wider ${isMobile ? 'block' : 'hidden lg:block'}`}>Product Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
