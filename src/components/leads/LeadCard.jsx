import React from 'react';
import { Edit2, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ActionMenu from '../common/ActionMenu';

/**
 * A card view for a single lead, primarily used on mobile screens.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.lead - The lead data object.
 * @param {Function} props.onEdit - Callback when edit button is clicked.
 * @param {Function} props.onDelete - Callback when delete button is clicked.
 * @returns {JSX.Element} The rendered LeadCard component.
 */
export default function LeadCard({ lead, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{lead.name}</h3>
          <div className="flex items-center text-slate-500 dark:text-gray-400 mt-1 text-sm">
            <Building2 size={16} className="mr-1.5" />
            {lead.company}
          </div>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="space-y-2 mb-5">
        <div className="flex items-center text-sm text-slate-600 dark:text-gray-300">
          <Mail size={16} className="mr-2 text-slate-400" />
          <a href={`mailto:${lead.email}`} className="hover:text-blue-600 truncate">{lead.email}</a>
        </div>
        {lead.phone && (
          <div className="flex items-center text-sm text-slate-600 dark:text-gray-300">
            <Phone size={16} className="mr-2 text-slate-400" />
            <a href={`tel:${lead.phone}`} className="hover:text-blue-600">{lead.phone}</a>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-gray-700">
        <ActionMenu lead={lead} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
