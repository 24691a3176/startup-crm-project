import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

export default function Analytics() {
  const [dateFilter, setDateFilter] = useState('last90');
  const { metrics, totalLeads, isLoading } = useAnalytics(dateFilter);

  const handleFilterChange = useCallback((filter) => {
    setDateFilter(filter);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8 w-full transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 p-4 md:p-6 lg:p-8 w-full relative overflow-hidden transition-colors duration-200">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 left-0 -ml-48 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-4 md:space-y-6 relative z-10"
      >

        {/* Header + Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/5 dark:bg-gray-800/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 dark:border-gray-700/60 shadow-sm transition-colors duration-200">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 font-medium">Track sales performance and growth trends with precision.</p>
          </div>
          <AnalyticsFilters activeFilter={dateFilter} onFilterChange={handleFilterChange} />
        </div>

        {totalLeads === 0 ? (
          <EmptyAnalyticsState />
        ) : (
          <>
            {/* KPI Cards */}
            <StatsCards metrics={metrics} />

            {/* Row 1: Pie + Funnel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <PieChartCard data={metrics.statusDistribution} totalLeads={totalLeads} />
              <FunnelChartCard data={metrics.funnelData} />
            </div>

            {/* Row 2: Bar + Line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <BarChartCard data={metrics.monthlyLeads} />
              <LineChartCard data={metrics.conversionTrend} />
            </div>

            {/* Row 3: Revenue + Lead Sources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <RevenueChartCard data={metrics.revenueByMonth} />
              <LeadSourceChart data={metrics.leadSources} />
            </div>

            {/* Row 4: Heatmap + Velocity + Top Performers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ActivityHeatmap data={metrics.heatmapData} />
              <SalesVelocityCard velocity={metrics.salesVelocity} />
              <TopPerformersCard performers={metrics.topPerformers} />
            </div>

            {/* Row 5: Forecast */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ForecastCard forecast={metrics.forecast} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
