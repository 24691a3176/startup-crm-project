// leadsStore.js
// Single source of truth for the initial mock lead data.
// Both Dashboard and the Leads CRUD page import from here so they
// always start with exactly the same records.

/** @type {Array<{id:number, name:string, company:string, email:string, phone:string, status:string, source:string, dateAdded:string}>} */
export const INITIAL_LEADS = [
  {
    id: 1,
    name: 'Alice Smith',
    company: 'Starlight Tech',
    email: 'alice@starlight.io',
    phone: '+1 234 567 890',
    status: 'New',
    source: 'Website',
    dateAdded: '2026-06-12',
  },
  {
    id: 2,
    name: 'Bob Johnson',
    company: 'Horizon Labs',
    email: 'bob@horizonlabs.com',
    phone: '+1 345 678 901',
    status: 'Contacted',
    source: 'LinkedIn',
    dateAdded: '2026-06-10',
  },
  {
    id: 3,
    name: 'Clara Oswald',
    company: 'Nebula Analytics',
    email: 'clara@nebula.co',
    phone: '+1 456 789 012',
    status: 'Meeting Scheduled',
    source: 'Referral',
    dateAdded: '2026-06-08',
  },
  {
    id: 4,
    name: 'Danny Rivera',
    company: 'Nova Retail Corp',
    email: 'danny@novaretail.com',
    phone: '+1 567 890 123',
    status: 'Won',
    source: 'Cold Call',
    dateAdded: '2026-06-05',
  },
  {
    id: 5,
    name: 'Eva Green',
    company: 'Quantum Logic',
    email: 'eva@quantum.io',
    phone: '+1 678 901 234',
    status: 'Proposal Sent',
    source: 'Email Campaign',
    dateAdded: '2026-06-04',
  },
  {
    id: 6,
    name: 'Fred Park',
    company: 'Aero Dynamics',
    email: 'fred@aerodynamics.org',
    phone: '+1 789 012 345',
    status: 'Lost',
    source: 'Other',
    dateAdded: '2026-06-02',
  },
  {
    id: 7,
    name: 'Sarah Connor',
    company: 'Apex Corp Solutions',
    email: 'sarah@apex.co',
    phone: '+1 890 123 456',
    status: 'Contacted',
    source: 'Referral',
    dateAdded: '2026-06-01',
  },
];
