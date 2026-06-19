import React, { memo } from 'react';
import { motion } from 'framer-motion';

const HEATMAP_SCALE = [
  { bg: '#F1F5F9', border: '#E2E8F0' },       // empty
  { bg: '#DBEAFE', border: '#BFDBFE' },       // low
  { bg: '#BFDBFE', border: '#93C5FD' },       // medium-low
  { bg: '#93C5FD', border: '#60A5FA' },       // medium
  { bg: '#60A5FA', border: '#3B82F6' },       // medium-high
  { bg: '#3B82F6', border: '#2563EB' },       // high
];

const ActivityHeatmap = ({ data = [] }) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const dataMap = data.reduce((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {});

  const maxCount = Math.max(1, ...data.map(d => d.count));

  const getColorIndex = (count) => {
    if (!count) return 0;
    const ratio = count / maxCount;
    if (ratio > 0.8) return 5;
    if (ratio > 0.6) return 4;
    if (ratio > 0.4) return 3;
    if (ratio > 0.2) return 2;
    return 1;
  };

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-[24px] border border-slate-100 dark:border-gray-700 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-full overflow-hidden"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Activity Heatmap</h3>
      </div>

      <div className="flex-grow flex flex-col justify-center overflow-x-auto pb-2 mt-2">
        <div className="flex gap-1.5 min-w-max mx-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1.5">
              {week.map(date => {
                const count = dataMap[date] || 0;
                const colorIdx = getColorIndex(count);
                const color = HEATMAP_SCALE[colorIdx];
                return (
                  <div
                    key={date}
                    className="w-3.5 h-3.5 rounded-[4px] border hover:ring-2 ring-blue-500 ring-offset-1 cursor-pointer transition-all hover:scale-125 z-10"
                    style={{ backgroundColor: color.bg, borderColor: color.border }}
                    title={`${date}: ${count} activities`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-end text-xs font-semibold text-slate-500 dark:text-gray-400 space-x-2">
          <span>Less</span>
          <div className="flex gap-1">
            {HEATMAP_SCALE.map((color, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-[4px] border"
                style={{ backgroundColor: color.bg, borderColor: color.border }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ActivityHeatmap);
