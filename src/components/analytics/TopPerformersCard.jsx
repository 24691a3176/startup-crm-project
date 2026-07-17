import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const TopPerformersCard = ({ performers = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="bg-surface rounded-[24px] border border-border p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-main">Top Performers</h3>
        <Trophy className="w-5 h-5 text-[#EAB308] drop-shadow-sm" />
      </div>
      
      <div className="flex-grow flex flex-col justify-center">
        {performers.length > 0 ? (
          <div className="space-y-4">
            {performers.map((performer, index) => {
              let badgeBg = '#DBEAFE';
              let badgeText = '#6B46C1';
              let rowBg = 'bg-surface hover:bg-surface-hover dark:bg-background';
              
              if (index === 0) {
                badgeBg = '#EAB308';
                badgeText = '#FFFFFF';
                rowBg = 'bg-yellow-50/50 hover:bg-yellow-50';
              } else if (index === 1) {
                badgeBg = '#94A3B8';
                badgeText = '#FFFFFF';
                rowBg = 'bg-background/50 hover:bg-surface-hover dark:bg-background';
              } else if (index === 2) {
                badgeBg = '#B45309';
                badgeText = '#FFFFFF';
                rowBg = 'bg-amber-50/30 hover:bg-amber-50/50';
              }

              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-xl border border-border transition-colors ${rowBg}`}>
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm shadow-sm"
                      style={{ backgroundColor: badgeBg, color: badgeText }}
                    >
                      {index + 1}
                    </div>
                    <span className="font-semibold text-text-main dark:text-white tracking-tight">{performer.name}</span>
                  </div>
                  <span className="font-extrabold text-[#16A34A] bg-surface px-2.5 py-1 rounded-lg shadow-sm border border-border">
                    ₹{(performer.revenue || 0).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-text-subtle font-medium">
            No won deals assigned to reps yet.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(TopPerformersCard);
