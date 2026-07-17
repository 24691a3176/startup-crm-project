export const STATUS_CONFIG = {
  New:                { pill: 'bg-surface-hover   text-text-muted  ring-slate-300/60',  dot: 'bg-slate-400',   label: 'New'               },
  Contacted:          { pill: 'bg-amber-100   text-amber-700  ring-amber-300/60',  dot: 'bg-accent',   label: 'Contacted'         },
  'Meeting Scheduled':{ pill: 'bg-violet-100  text-violet-700 ring-violet-300/60', dot: 'bg-violet-500',  label: 'Meeting Scheduled' },
  'Proposal Sent':    { pill: 'bg-primary/15    text-primary   ring-blue-300/60',   dot: 'bg-primary/100',    label: 'Proposal Sent'     },
  Won:                { pill: 'bg-emerald-100 text-emerald-700 ring-emerald-300/60',dot: 'bg-emerald-500', label: 'Won'               },
  Lost:               { pill: 'bg-red-100     text-red-600    ring-red-300/60',    dot: 'bg-danger/100',     label: 'Lost'              },
};

export const FALLBACK = {
  pill: 'bg-surface-hover text-text-muted ring-slate-200',
  dot: 'bg-slate-400',
  label: '',
};
