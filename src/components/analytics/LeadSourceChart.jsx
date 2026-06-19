import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SOURCE_COLORS = {
  Website: '#3B82F6',
  Referral: '#10B981',
  Ads: '#F59E0B',
  LinkedIn: '#0EA5E9',
  Instagram: '#EC4899',
  'Cold Email': '#6366F1',
};

const FALLBACK_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#0EA5E9', '#EC4899', '#6366F1'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-xl">
        <p className="font-semibold">{label}</p>
        <p className="text-sm font-medium mt-1">{payload[0].value} Leads</p>
      </div>
    );
  }
  return null;
};

const LeadSourceChart = ({ data = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-[24px] border border-slate-100 dark:border-gray-700 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-[400px]"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Lead Sources</h3>
      </div>
      
      <div className="flex-grow w-full h-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                allowDecimals={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }}
                width={80}
              />
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={1200} barSize={24}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SOURCE_COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-medium">No source data available</div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(LeadSourceChart);
