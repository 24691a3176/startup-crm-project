import { INITIAL_LEADS } from '../data/leadsStore';

const STORAGE_KEY = 'crm_leads_v1';

export function normaliseLead(lead) {
  const createdAt =
    lead.createdAt ??
    (lead.dateAdded ? new Date(lead.dateAdded + 'T00:00:00').toISOString() : new Date().toISOString());
  const id = lead.id !== undefined ? String(lead.id) : crypto.randomUUID();
  return { ...lead, id, createdAt };
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normaliseLead);
      }
    }
  } catch (err) {
    console.warn('[LeadContext] localStorage read failed – falling back to seed data.', err);
  }
  return INITIAL_LEADS.map(normaliseLead);
}

export function saveToStorage(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('[LeadContext] localStorage write failed.', err);
  }
}
