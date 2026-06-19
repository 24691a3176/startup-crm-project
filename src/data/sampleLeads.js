/**
 * @file sampleLeads.js
 * @description Seed data for Startup CRM Lite.
 *
 * These leads are used as the `initialValue` for the useLocalStorage hook
 * inside LeadContext. They only appear when localStorage has no prior data,
 * i.e. the very first time a user opens the app or after clearing storage.
 *
 * Status distribution:
 *   2 × New  |  1 × Contacted  |  1 × Meeting Scheduled  |  1 × Won  |  1 × Lost
 */

/** @type {import('../context/LeadContext').Lead[]} */
export const SAMPLE_LEADS = [
  {
    id: 'a1b2c3d4-1111-4e5f-8a9b-000000000001',
    name: 'Ananya Sharma',
    company: 'NovaByte Technologies',
    email: 'ananya@novabyte.in',
    phone: '+91 98765 43210',
    status: 'New',
    source: 'Website',
    createdAt: '2026-06-15T09:30:00.000Z',
  },
  {
    id: 'a1b2c3d4-2222-4e5f-8a9b-000000000002',
    name: 'Rohan Mehta',
    company: 'ClearEdge Analytics',
    email: 'rohan@clearedge.co',
    phone: '+91 87654 32109',
    status: 'New',
    source: 'LinkedIn',
    createdAt: '2026-06-14T11:15:00.000Z',
  },
  {
    id: 'a1b2c3d4-3333-4e5f-8a9b-000000000003',
    name: 'Priya Nair',
    company: 'Zenith Cloud Solutions',
    email: 'priya@zenithcloud.io',
    phone: '+91 76543 21098',
    status: 'Contacted',
    source: 'Referral',
    createdAt: '2026-06-12T14:45:00.000Z',
  },
  {
    id: 'a1b2c3d4-4444-4e5f-8a9b-000000000004',
    name: 'Vikram Desai',
    company: 'Orbit Fintech',
    email: 'vikram@orbitfin.com',
    phone: '+91 65432 10987',
    status: 'Meeting Scheduled',
    source: 'Cold Call',
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  {
    id: 'a1b2c3d4-5555-4e5f-8a9b-000000000005',
    name: 'Kavitha Rao',
    company: 'PixelCraft Studios',
    email: 'kavitha@pixelcraft.in',
    phone: '+91 54321 09876',
    status: 'Won',
    source: 'Email Campaign',
    createdAt: '2026-06-08T16:20:00.000Z',
  },
  {
    id: 'a1b2c3d4-6666-4e5f-8a9b-000000000006',
    name: 'Arjun Iyer',
    company: 'GreenLeaf Agritech',
    email: 'arjun@greenleaf.co.in',
    phone: '+91 43210 98765',
    status: 'Lost',
    source: 'Other',
    createdAt: '2026-06-05T08:10:00.000Z',
  },
];
