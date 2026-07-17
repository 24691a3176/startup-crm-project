import React, { memo } from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface/80 dark:bg-surface/80 backdrop-blur-sm rounded-2xl border border-border/60 p-12 shadow-sm flex flex-col items-center justify-center text-center mt-6">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-text-main mb-2">No analytics available yet</h2>
      <p className="text-text-muted max-w-sm mx-auto mb-8">
        Add your first lead to start tracking business performance, conversions, and revenue forecasting.
      </p>
      <button 
        onClick={() => navigate('/leads')}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md shadow-primary/20 hover:shadow-lg transition-all"
      >
        <Plus className="w-5 h-5" />
        <span>Add First Lead</span>
      </button>
    </div>
  );
};

export default memo(EmptyAnalyticsState);
