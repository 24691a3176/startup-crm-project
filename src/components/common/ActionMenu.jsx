import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * A reusable actions menu component with Edit and Delete options.
 * 
 * @param {Object} props
 * @param {Object} props.lead - The lead object to act upon
 * @param {Function} [props.onEdit] - Optional callback for edit action
 * @param {Function} [props.onDelete] - Optional callback for delete action
 */
export default function ActionMenu({ lead, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setIsOpen(false);
    if (onEdit) {
      onEdit(lead);
    } else {
      // If no onEdit provided (e.g., from Dashboard), navigate to leads page with state
      navigate('/leads', { state: { editLead: lead } });
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
    if (onDelete) {
      onDelete(lead.id || lead._id);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors"
        aria-label="Actions"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-100 dark:border-gray-700">
          <div className="py-1">
            <button
              onClick={handleEdit}
              className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit2 size={16} className="mr-2 text-slate-400 group-hover:text-blue-500" />
              Edit Lead
            </button>
            <button
              onClick={handleDelete}
              className="group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={16} className="mr-2 text-red-400 group-hover:text-red-500" />
              Delete Lead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
