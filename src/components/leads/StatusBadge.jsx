import React from 'react';

/**
 * A pill-shaped badge component to display the status of a lead.
 *
 * @param {Object} props - The component props.
 * @param {string} props.status - The lead's current status.
 * @returns {JSX.Element} The rendered StatusBadge component.
 */
export default function StatusBadge({ status }) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'New':
        return 'bg-surface-hover text-text-main border-border';
      case 'Contacted':
        return 'bg-primary/15 text-primary border-primary/30';
      case 'Meeting Scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Proposal Sent':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Won':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Lost':
        return 'bg-red-100 text-red-700 border-danger/30';
      default:
        return 'bg-surface-hover text-text-main border-border';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
      {status || 'Unknown'}
    </span>
  );
}
