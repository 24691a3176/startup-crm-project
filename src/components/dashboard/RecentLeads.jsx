import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * A component that displays a table of the most recently added leads.
 *
 * @param {Object} props - The component props.
 * @param {Array<{id: string|number, name: string, company: string, status: string, dateAdded: string}>} props.leads - The array of leads.
 * @returns {JSX.Element} The rendered RecentLeads component.
 */
export default function RecentLeads({ leads = [] }) {
  const navigate = useNavigate();
  // Sort leads by date added or createdAt and take top 5
  const recentLeads = [...leads]
    .sort((a, b) => {
      const aDate = new Date(a.dateAdded || a.createdAt);
      const bDate = new Date(b.dateAdded || b.createdAt);
      return bDate - aDate;
    })
    .slice(0, 5);

  const getStatusBadge = (status) => {
    // Styling classes that align with the requested color palette
    const statusStyles = {
      'New': 'bg-blue-50 text-blue-600 border border-blue-200',
      'Contacted': 'bg-amber-50 text-amber-500 border border-amber-200',
      'Qualified': 'bg-indigo-50 text-indigo-600 border border-indigo-200',
      'Proposal': 'bg-purple-50 text-purple-600 border border-purple-200',
      'Won': 'bg-green-50 text-green-500 border border-green-200',
      'Lost': 'bg-red-50 text-red-500 border border-red-200',
    };

    const style = statusStyles[status] || 'bg-slate-50 dark:bg-gray-900 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-700';
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Leads</h3>
        <button onClick={() => navigate('/leads')} className="text-blue-600 text-sm font-medium hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-900 text-slate-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date Added</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentLeads.length > 0 ? (
              recentLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 dark:text-white">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-gray-300">{lead.company}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400 text-sm">
                    {formatDate(lead.dateAdded)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors" aria-label="Actions">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-gray-400">
                  No recent leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
