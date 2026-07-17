import React, { memo } from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface/50 dark:bg-surface/50 p-4 rounded-2xl border border-border/60">
        <div>
          <div className="h-8 bg-surface-hover rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-surface-hover rounded-lg w-96"></div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-9 w-24 bg-surface-hover rounded-full"></div>
          ))}
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-6 h-32 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-surface-hover rounded"></div>
              <div className="h-8 w-8 bg-surface-hover rounded-xl"></div>
            </div>
            <div className="h-8 w-24 bg-surface-hover rounded"></div>
          </div>
        ))}
      </div>

      {/* Chart Rows Skeleton */}
      {[1, 2, 3].map(row => (
        <div key={row} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-2xl border border-border h-[400px] p-6">
            <div className="h-6 w-48 bg-surface-hover rounded mb-6"></div>
            <div className="h-[300px] w-full bg-surface-hover rounded-xl"></div>
          </div>
          <div className="bg-surface rounded-2xl border border-border h-[400px] p-6">
            <div className="h-6 w-48 bg-surface-hover rounded mb-6"></div>
            <div className="h-[300px] w-full bg-surface-hover rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(LoadingSkeleton);
