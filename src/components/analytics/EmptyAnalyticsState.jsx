import React, { memo } from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/60 p-12 shadow-sm flex flex-col items-center justify-center text-center mt-6">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No analytics available yet</h2>
      <p className="text-slate-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
        Add your first lead to start tracking business performance, conversions, and revenue forecasting.
      </p>
      <button 
        onClick={() => navigate('/leads')}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
      >
        <Plus className="w-5 h-5" />
        <span>Add First Lead</span>
      </button>
    </div>
  );
};

export default memo(EmptyAnalyticsState);
