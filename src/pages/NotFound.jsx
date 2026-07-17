// Import Link from react-router-dom to safely route the user back to valid pages
import { Link } from 'react-router-dom';
// Import Lucide React icons for the navigation arrow and information mark
import { AlertCircle, ArrowLeft } from 'lucide-react';

// Define the NotFound 404 page component
export default function NotFound() {
  return (
    // Centered wrapper box utilizing flexbox, padding, and animations
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Visual illustration of the 404 error using custom vector styles */}
      <div className="relative mb-6">
        {/* Large abstract neon background glow to represent space and modern architecture */}
        <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-2xl scale-120"></div>

        {/* Main circular graphic representing the broken connection */}
        <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center animate-spin-slow">
          {/* Inner ring containing warning symbol */}
          <div className="w-24 h-24 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-primary" />
          </div>
        </div>
      </div>

      {/* Primary error status heading */}
      <h1 className="font-roboto font-extrabold text-7xl text-text-main dark:text-white tracking-tighter">404</h1>
      {/* Main explanation title */}
      <h2 className="font-roboto font-bold text-xl text-text-main dark:text-white mt-4">Module Not Found</h2>

      {/* Supporting details text explaining the cause */}
      <p className="text-text-muted font-roboto text-sm max-w-md mt-2">
        The CRM module or pathway you are trying to reach does not exist or has been relocated to another node.
      </p>

      {/* Action button redirecting the user back to the primary Dashboard path */}
      <Link
        to="/"
        className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-300 mt-8 group"
      >
        {/* Back arrow with left hover slide animation */}
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
