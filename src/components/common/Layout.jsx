import { Suspense, useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DarkModeToggle from './DarkModeToggle';
import { Search, Bell, Plus, Menu, LayoutDashboard, Users, BarChart3, X, UserPlus, CheckCircle2, RefreshCw, XCircle, Check, Trash2 } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';

const RouteLoader = () => (
  <div className="w-full space-y-6 animate-pulse">
    <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded-lg w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="h-32 bg-slate-200 dark:bg-gray-700 rounded-2xl"></div>
      <div className="h-32 bg-slate-200 dark:bg-gray-700 rounded-2xl"></div>
      <div className="h-32 bg-slate-200 dark:bg-gray-700 rounded-2xl"></div>
      <div className="h-32 bg-slate-200 dark:bg-gray-700 rounded-2xl"></div>
    </div>
    <div className="h-80 bg-slate-200 dark:bg-gray-700 rounded-2xl"></div>
  </div>
);

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { leads, notifications, markNotificationsAsRead, clearNotifications } = useLeads();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Notifications State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    return (
      (lead.name && lead.name.toLowerCase().includes(query)) ||
      (lead.company && lead.company.toLowerCase().includes(query)) ||
      (lead.email && lead.email.toLowerCase().includes(query)) ||
      (lead.phone && lead.phone.toLowerCase().includes(query)) ||
      (lead.status && lead.status.toLowerCase().includes(query))
    );
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'add': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'convert': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'loss': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'update': return <RefreshCw className="w-4 h-4 text-amber-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.toString().split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-500/30 text-slate-900 dark:text-yellow-100 rounded px-0.5">{part}</span>
      ) : part
    );
  };

  return (
    <div className="flex bg-slate-50 dark:bg-gray-900 text-text-dark dark:text-gray-100 font-roboto min-h-screen transition-colors duration-200 pb-16 md:pb-0">
      {/* Desktop/Tablet Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex w-4/5 max-w-sm flex-col h-full bg-white dark:bg-gray-900 shadow-xl">
            <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 z-40 flex justify-around items-center px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full min-h-[44px] min-w-[44px] space-y-1 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white dark:hover:text-gray-200'
                }`
              }
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          );
        })}
      </nav>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-card dark:bg-gray-800 border-b border-slate-200/80 dark:border-gray-700 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors duration-200">
          
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 min-h-[44px] min-w-[44px] -ml-2 text-slate-600 dark:text-gray-300 focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="ml-2 font-bold text-[#2563EB] text-lg">S-CRM</span>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:flex items-center w-64 lg:w-96 relative" ref={searchRef}>
            <div className={`relative w-full flex items-center transition-all duration-300 rounded-full border border-transparent bg-slate-100 dark:bg-gray-700 ${isSearchOpen && searchQuery ? 'ring-2 ring-blue-500/50 border-blue-500/50 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-gray-600'}`}>
              <Search className="w-4 h-4 text-text-gray dark:text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search leads, deals..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => { if (searchQuery) setIsSearchOpen(true); }}
                className="bg-transparent border-0 outline-none text-sm w-full py-2 pl-9 pr-8 placeholder-text-gray dark:placeholder-gray-400 text-text-dark dark:text-gray-100 focus:ring-0 rounded-full"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 focus:outline-none">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && searchQuery && (
              <div className="absolute top-12 left-0 w-full md:w-[400px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 dark:border-gray-700 overflow-hidden z-50 flex flex-col max-h-[400px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 bg-slate-50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Search Results
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        className="flex flex-col p-3 hover:bg-slate-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => { clearSearch(); navigate('/leads'); }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm text-slate-800 dark:text-white">
                            {highlightText(lead.name, searchQuery)}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300">
                            {highlightText(lead.status, searchQuery)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-400 flex flex-wrap gap-x-2">
                          <span>{highlightText(lead.company, searchQuery)}</span>
                          {lead.email && <span className="truncate max-w-[150px]">• {highlightText(lead.email, searchQuery)}</span>}
                          {lead.phone && <span>• {highlightText(lead.phone, searchQuery)}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 px-4 text-center">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-600 dark:text-gray-300 font-medium">No results found</p>
                      <p className="text-sm text-slate-500 mt-1">We couldn't find any leads matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 lg:space-x-5 ml-auto md:ml-0">
            <DarkModeToggle />

            {/* Quick Action Add Lead button with hover actions */}
            <button 
              onClick={() => navigate('/leads/new')}
              className="hidden sm:flex items-center space-x-1.5 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-300 min-h-[44px] transform hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}
            >
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </button>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors duration-200 ${isNotifOpen ? 'bg-slate-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-text-gray dark:text-gray-400 hover:text-text-dark dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700'}`}
              >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 dark:border-gray-700 overflow-hidden z-50 flex flex-col max-h-[450px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center bg-slate-50/50 dark:bg-gray-900/50">
                    <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button 
                          onClick={markNotificationsAsRead}
                          className="text-xs flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          <Check className="w-3 h-3 mr-1" /> Mark all read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearNotifications}
                          className="text-xs flex items-center text-slate-500 hover:text-red-500 transition-colors ml-2"
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1 p-0">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-gray-700/50">
                        {notifications.map(notif => (
                          <div key={notif.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-colors ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${!notif.isRead ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-gray-700'}`}>
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-800 dark:text-gray-100' : 'text-slate-600 dark:text-gray-300'}`}>
                                  {notif.message}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {!notif.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 px-4 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                          <Bell className="w-8 h-8 text-slate-300 dark:text-gray-600" />
                        </div>
                        <p className="text-slate-600 dark:text-gray-300 font-medium">All caught up!</p>
                        <p className="text-sm text-slate-500 mt-1">No new notifications right now.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="w-px h-6 bg-slate-200 dark:bg-gray-600"></span>

            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-text-dark dark:text-white">Dev Workspace</p>
              <p className="text-[10px] text-text-gray dark:text-gray-400 font-semibold">Startup CRM Lite</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 transition-colors duration-200">
          <Suspense fallback={<RouteLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
