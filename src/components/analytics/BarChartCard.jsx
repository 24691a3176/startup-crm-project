import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-xl">
        <p className="font-semibold text-secondary">{label}</p>
        <p className="text-sm font-medium mt-1">{payload[0].value} Leads</p>
      </div>
    );
  }
  return null;
};

const BarChartCard = ({ data = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="bg-surface rounded-[24px] border border-border p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-[400px]"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-main tracking-tight">Monthly Leads Trend</h3>
      </div>
      
      <div className="flex-grow w-full h-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#6B46C1" stopOpacity={1}/>
                </linearGradient>
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
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#barGradient)" 
                radius={[6, 6, 0, 0]} 
                animationDuration={1200}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-text-subtle font-medium">No data available</div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(BarChartCard);
