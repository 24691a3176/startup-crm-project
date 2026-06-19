import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const ForecastCard = ({ forecast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="rounded-[24px] border border-slate-700/50 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-full text-white relative overflow-hidden group"
      style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)' }}
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-screen filter blur-[60px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-medium text-slate-300">Revenue Forecast</h3>
        <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
          <Target className="w-5 h-5 text-[#3B82F6]" />
        </div>
      </div>
      
      <div className="flex-grow flex flex-col justify-center relative z-10">
        <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Predicted Revenue Next Month</p>
        <div className="text-4xl font-extrabold text-[#3B82F6] mb-8 tracking-tight">
          ₹{(forecast || 0).toLocaleString()}
        </div>
        
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center gap-1 text-sm font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Strong Growth
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg ml-auto shadow-sm border border-white/20">
            94% Confidence
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ForecastCard);
