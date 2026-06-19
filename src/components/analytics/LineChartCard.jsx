import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-xl">
        <p className="font-semibold text-emerald-200">{label}</p>
        <p className="text-sm font-bold mt-1 text-emerald-400">{payload[0].value}% Conversion</p>
      </div>
    );
  }
  return null;
};

const LineChartCard = ({ data = [] }) => {
  return (<motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -6 }}
    transition={{ duration: 0.4 }}
    className="bg-white dark:bg-gray-800 rounded-[24px] border border-slate-100 dark:border-gray-700 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-[400px]"
  >
    <div className="mb-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Conversion Trend</h3>
    </div>

    <div className="flex-grow w-full h-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10B981" floodOpacity="0.15" />
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
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#10B981"
              strokeWidth={4}
              filter="url(#glow)"
              dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#059669' }}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#059669' }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 font-medium">No data available</div>
      )}
    </div>
  </motion.div>
  );
};

export default memo(LineChartCard);
