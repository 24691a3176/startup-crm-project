// Import NavLink from react-router-dom to handle active-state navigation classes automatically
import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
// Import Lucide React icons for highly polished visual navigation markers
import { LayoutDashboard, Users, BarChart3, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Define the Sidebar component representing our main dashboard navigation layout
export default function Sidebar({ isMobile, onClose }) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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
    <aside className={`${isMobile ? 'w-full' : 'w-56 lg:w-64'} bg-surface/8 dark:bg-surface/80 dark:bg-surface/90 backdrop-blur-xl border-r border-border min-h-screen flex flex-col justify-between p-4 lg:p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] shrink-0 z-50 relative transition-all duration-300`}>
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
              <h1 className="font-roboto font-bold text-[#6B46C1] tracking-tight text-base leading-none">Startup CRM</h1>
              <span className={`text-[10px] font-roboto font-bold text-text-subtle uppercase tracking-widest mt-1 ${isMobile ? 'block' : 'hidden lg:block'}`}>Lite Edition</span>
            </div>
          </div>
          {isMobile && (
            <button onClick={onClose} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted focus:outline-none">
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
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold relative overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-surface before:shadow-[0_0_10px_white]'
                    // Styling for inactive state: muted text and soft hovers
                    : 'text-text-muted hover:bg-surface-hover dark:bg-surface dark:hover:bg-surface-hover/50 hover:text-text-main dark:hover:text-text-main border-l-4 border-transparent'
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
      <div className="pt-6 border-t border-border relative" ref={dropdownRef}>
        
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute bottom-full mb-2 left-4 right-4 bg-surface rounded-xl shadow-xl border border-border overflow-hidden z-50">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-text-main hover:bg-surface-hover transition-colors">
              <User size={16} />
              <span>My Profile</span>
            </button>
            <div className="h-px bg-surface-hover w-full"></div>
            <button 
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-danger/10 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* User Account block showing avatar and dynamic metadata */}
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center justify-between p-2 lg:p-3 bg-surface-hover/50 rounded-[20px] border border-border dark:border-border-focus hover:bg-surface-hover dark:hover:bg-surface-hover transition-colors cursor-pointer min-h-[44px]`}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            {/* Avatar image with status dot indicator */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-gray-600 dark:to-gray-500 flex items-center justify-center text-text-main font-bold text-sm shadow-sm border-2 border-white dark:border-border">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {/* Green active status indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-white dark:border-surface shadow-sm"></span>
            </div>
            {/* Name and role labels */}
            <div className={`overflow-hidden`}>
              <p className="text-sm font-bold text-text-main truncate">
                {user?.name || 'User'}
              </p>
              <p className={`text-[11px] font-semibold text-text-muted truncate uppercase tracking-wider ${isMobile ? 'block' : 'hidden lg:block'}`}>
                {user?.role || 'PRODUCT ADMIN'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
