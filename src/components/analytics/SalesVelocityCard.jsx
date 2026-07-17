import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const SalesVelocityCard = ({ velocity }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="rounded-[24px] border border-border/20 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-full text-white relative overflow-hidden group"
      style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7)' }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-surface rounded-full mix-blend-overlay filter blur-[60px] opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 group-hover:opacity-20 transition-opacity"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-medium text-white/90">Sales Velocity</h3>
        <div className="p-2.5 bg-surface/10 dark:bg-surface/10 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
          <Zap className="w-5 h-5 text-white fill-current" />
        </div>
      </div>
      
      <div className="flex-grow flex flex-col justify-center relative z-10">
        <div className="text-4xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
          ₹{(velocity || 0).toLocaleString()}<span className="text-base text-white/70 font-medium ml-1 tracking-normal">/day</span>
        </div>
        
        <div className="flex items-center text-sm font-medium mt-auto bg-surface/10 dark:bg-surface/10 rounded-lg py-2 px-3 backdrop-blur-sm border border-white/5 w-max">
          <span className="flex items-center text-[#22C55E]">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            +12.5%
          </span>
          <span className="text-white/60 ml-2">vs last period</span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(SalesVelocityCard);
