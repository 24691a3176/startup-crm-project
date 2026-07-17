import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { useLeads } from '../context/LeadContext';

/**
 * The main Dashboard page component, assembling various dashboard widgets.
 * 
 * @returns {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard() {
  const { leads } = useLeads();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">Dashboard</h1>
            <p className="text-text-muted mt-1 text-sm md:text-base">Welcome back! Here's what's happening with your leads today.</p>
          </div>
          <div>
            <span className="inline-block text-sm font-medium text-text-muted bg-surface px-3 py-1.5 rounded-full border border-border shadow-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stats Row - Responsive: 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="Total Leads"
            value="1,284"
            icon={<Users size={24} />}
            change={12.5}
            color="blue"
          />
          <StatsCard
            title="Conversion Rate"
            value="18.2%"
            icon={<TrendingUp size={24} />}
            change={2.4}
            color="green"
          />
          <StatsCard
            title="Revenue Pipeline"
            value="$425k"
            icon={<DollarSign size={24} />}
            change={8.1}
            color="amber"
          />
          <StatsCard
            title="Active Deals"
            value="64"
            icon={<Activity size={24} />}
            change={-4.2}
            color="red"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* Top Row: Pipeline Overview (left) and Quick Actions (right) */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            <PipelineOverview leads={leads} />
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <QuickActions />
          </div>

          {/* Bottom Row: Recent Leads (full width) */}
          <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
            <RecentLeads leads={leads} />
          </div>

        </div>
      </div>
    </div>
  );
}
