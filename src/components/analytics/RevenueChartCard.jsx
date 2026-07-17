import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-xl">
        <p className="text-xs text-text-subtle font-semibold mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-extrabold text-emerald-400">Revenue : ₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const RevenueChartCard = ({ data = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="bg-surface rounded-[24px] border border-border p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-[400px]"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-main tracking-tight">Revenue Trend</h3>
      </div>
      
      <div className="flex-grow w-full h-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
                <filter id="revenueGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#22C55E" floodOpacity="0.15" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#22C55E" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#revenueGradient)" 
                filter="url(#revenueGlow)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#22C55E' }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-text-subtle font-medium">No data available</div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(RevenueChartCard);
