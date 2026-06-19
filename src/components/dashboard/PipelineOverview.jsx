/**
 * A component that displays a visual horizontal bar representing the distribution of leads across different statuses.
 *
 * @param {Object} props - The component props.
 * @param {Array<{status: string, [key: string]: any}>} props.leads - The array of lead objects to analyze.
 * @returns {JSX.Element} The rendered PipelineOverview component.
 */
export default function PipelineOverview({ leads = [] }) {
  // Statuses based on standard CRM flow
  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
  
  // Count leads per status
  const counts = leads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const total = leads.length || 1; // Prevent division by zero

  // Using arbitrary values or closely matched tailwind colors to match requested palette
  const colorMap = {
    'New': 'bg-blue-600',        // Primary
    'Contacted': 'bg-amber-500', // Warning
    'Qualified': 'bg-blue-400',
    'Proposal': 'bg-indigo-500',
    'Won': 'bg-green-500',       // Success
    'Lost': 'bg-red-500'         // Danger
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Pipeline Overview</h3>
      
      <div className="w-full h-4 flex rounded-full overflow-hidden mb-6 bg-slate-100">
        {statuses.map(status => {
          const count = counts[status] || 0;
          if (count === 0) return null;
          const percentage = (count / total) * 100;
          return (
            <div 
              key={status} 
              style={{ width: `${percentage}%` }}
              className={`${colorMap[status] || 'bg-slate-300'} h-full transition-all duration-500 hover:opacity-90`}
              title={`${status}: ${count} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statuses.map(status => {
          const count = counts[status] || 0;
          return (
            <div key={status} className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${colorMap[status] || 'bg-slate-300'}`} />
              <span className="text-sm text-slate-600 dark:text-gray-300 flex-1">{status}</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
