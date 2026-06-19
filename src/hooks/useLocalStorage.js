import { useState, useCallback } from 'react';

/**
 * useLocalStorage – A drop-in replacement for `useState` that persists
 * the value to `window.localStorage` under the given key.
 *
 * @template T
 * @param {string} key - The localStorage key to read / write.
 * @param {T} initialValue - Fallback value used when:
 *   • the key does not exist in localStorage yet,
 *   • the stored JSON is corrupt / unparseable,
 *   • localStorage is unavailable (e.g. private-browsing quota exceeded).
 *
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 *   A tuple identical to React's `useState`:
 *   - `storedValue` – the current value (from localStorage or initialValue)
 *   - `setValue`     – setter that updates React state AND localStorage at
 *                      the same time. Accepts a direct value **or** an
 *                      updater function `(prev) => next`, just like useState.
 *
 * @example
 * // Persist a simple boolean (dark-mode toggle)
 * const [isDark, setIsDark] = useLocalStorage('theme-dark', false);
 *
 * @example
 * // Persist an array of objects (leads list)
 * const [leads, setLeads] = useLocalStorage('crm-leads', []);
 *
 * @example
 * // Updater-function form
 * setLeads(prev => [...prev, newLead]);
 */
export function useLocalStorage(key, initialValue) {
  // ── Lazy initialiser (runs only on first render) ──────────────────────
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Key exists → parse and return it; otherwise fall back to initial
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      // JSON.parse failed OR localStorage threw (private browsing, etc.)
      // → gracefully degrade to the initial value
      return initialValue;
    }
  });

  // ── Setter: updates state AND writes to localStorage simultaneously ──
  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        // Support updater-function form: setValue(prev => …)
        const valueToStore = value instanceof Function ? value(prev) : value;

        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch {
          // Quota exceeded or localStorage unavailable – state still updates
          // in-memory so the current session works even without persistence.
          console.warn(
            `[useLocalStorage] Could not write key "${key}" to localStorage.`
          );
        }

        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
