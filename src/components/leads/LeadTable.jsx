
import StatusBadge from './StatusBadge';
import ActionMenu from '../common/ActionMenu';

/**
 * A table view displaying all leads, typically used on larger screens.
 *
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.leads - Array of lead data objects.
 * @param {Function} props.onEdit - Callback when edit action is triggered.
 * @param {Function} props.onDelete - Callback when delete action is triggered.
 * @returns {JSX.Element} The rendered LeadTable component.
 */
export default function LeadTable({ leads, onEdit, onDelete }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-8 text-center text-slate-500 dark:text-gray-400">
        No leads found. Add a new lead to get started.
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50 dark:bg-gray-900 text-slate-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-gray-700">
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Company</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium">Source</th>
            <th className="px-6 py-4 font-medium">Date Added</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors">
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-800 dark:text-white">{lead.name}</div>
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-gray-300">{lead.company}</td>
              <td className="px-6 py-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-gray-300 text-sm">
                <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-gray-400 text-sm">{lead.source}</td>
              <td className="px-6 py-4 text-slate-500 dark:text-gray-400 text-sm">
                {formatDate(lead.dateAdded || lead.createdAt)}
              </td>
              <td className="px-6 py-4 text-right">
                <ActionMenu lead={lead} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
