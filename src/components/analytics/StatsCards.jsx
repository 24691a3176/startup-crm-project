import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, IndianRupee, Clock, AlertTriangle, Target } from 'lucide-react';

const StatCard = memo(({ title, value, icon: Icon, trend, iconColor, iconBg, trendColor }) => {
  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-surface rounded-[24px] border border-border shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
      
      <div className="p-6 relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">{title}</h3>
          <div className={`p-2.5 rounded-full`} style={{ backgroundColor: iconBg }}>
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-text-main tracking-tight">{value}</div>
          {trend !== undefined && trend !== null && (
            <div className={`flex items-center text-sm font-bold ${trendColor || 'text-emerald-500'} bg-surface px-2 py-1 rounded-lg shadow-sm border border-border`}>
              {trend > 0 ? '+' : ''}{trend}%
              <TrendingUp className="w-3.5 h-3.5 ml-1" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

const StatsCards = ({ metrics }) => {
  const lastRate = metrics?.conversionTrend?.[metrics.conversionTrend.length - 1]?.rate || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <StatCard
        title="Total Leads"
        value={metrics?.totalLeads || 0}
        icon={Users}
        iconColor="#6B46C1"
        iconBg="#DBEAFE"
      />
      <StatCard
        title="Conversion Rate"
        value={`${lastRate}%`}
        icon={Target}
        trend={4.2}
        trendColor="text-emerald-500"
        iconColor="#16A34A"
        iconBg="#DCFCE7"
      />
      <StatCard
        title="Pipeline Value"
        value={`₹${(metrics?.pipelineValue || 0).toLocaleString()}`}
        icon={TrendingUp}
        iconColor="#8B5CF6"
        iconBg="#F3E8FF"
      />
      <StatCard
        title="Won Revenue"
        value={`₹${(metrics?.wonRevenue || 0).toLocaleString()}`}
        icon={IndianRupee}
        iconColor="#22C55E"
        iconBg="#DCFCE7"
      />
      <StatCard
        title="Avg Sales Cycle"
        value={`${metrics?.averageSalesCycle || 0} Days`}
        icon={Clock}
        iconColor="#F59E0B"
        iconBg="#FFEDD5"
      />
      <StatCard
        title="Lost Rate"
        value={`${metrics?.lostRate || 0}%`}
        icon={AlertTriangle}
        iconColor="#EF4444"
        iconBg="#FEE2E2"
      />
    </div>
  );
};

export default memo(StatsCards);
