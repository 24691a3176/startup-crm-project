
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext';
import ActionMenu from '../common/ActionMenu';

/**
 * A component that displays a table of the most recently added leads.
 *
 * @param {Object} props - The component props.
 * @param {Array<{id: string|number, name: string, company: string, status: string, dateAdded: string}>} props.leads - The array of leads.
 * @returns {JSX.Element} The rendered RecentLeads component.
 */
export default function RecentLeads({ leads = [] }) {
  const navigate = useNavigate();
  const { deleteLead } = useLeads();
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
      'New': 'bg-primary/10 text-primary border border-primary/30',
      'Contacted': 'bg-amber-50 text-accent border border-amber-200',
      'Qualified': 'bg-indigo-50 text-indigo-600 border border-indigo-200',
      'Proposal': 'bg-purple-50 text-purple-600 border border-purple-200',
      'Won': 'bg-green-50 text-green-500 border border-green-200',
      'Lost': 'bg-danger/10 text-red-500 border border-danger/30',
    };

    const style = statusStyles[status] || 'bg-background text-text-muted border border-border';
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

  const handleDelete = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(leadId);
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-main dark:text-white">Recent Leads</h3>
        <button onClick={() => navigate('/leads')} className="text-primary text-sm font-medium hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-background text-text-muted text-xs uppercase tracking-wider">
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
                <tr key={lead.id} className="hover:bg-surface-hover dark:bg-background transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-main dark:text-white">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{lead.company}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 text-text-muted text-sm">
                    {formatDate(lead.dateAdded)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu lead={lead} onDelete={handleDelete} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
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
