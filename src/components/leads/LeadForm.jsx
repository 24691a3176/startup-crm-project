import React, { useState, useEffect } from 'react';

/**
 * Form for creating a new lead or editing an existing one.
 *
 * @param {Object} props - The component props.
 * @param {Object} [props.initialData] - Data to pre-fill when editing. Null for creation.
 * @param {Function} props.onSubmit - Callback when the form is submitted successfully.
 * @param {Function} props.onCancel - Callback when form is cancelled.
 * @returns {JSX.Element} The rendered LeadForm component.
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-main mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-2.5 bg-surface dark:bg-surface-hover border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none transition-shadow min-h-[44px] text-text-main ${
            errors.name ? 'border-red-500 dark:border-red-400' : 'border-border-focus'
          }`}
          placeholder="e.g. Jane Doe"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-text-main mb-1">
          Company *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={`w-full p-2.5 bg-surface dark:bg-surface-hover border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none transition-shadow min-h-[44px] text-text-main ${
            errors.company ? 'border-red-500 dark:border-red-400' : 'border-border-focus'
          }`}
          placeholder="e.g. Acme Corp"
        />
        {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2.5 bg-surface dark:bg-surface-hover border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none transition-shadow min-h-[44px] text-text-main ${
            errors.email ? 'border-red-500 dark:border-red-400' : 'border-border-focus'
          }`}
          placeholder="jane@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-main mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2.5 bg-surface dark:bg-surface-hover border border-border-focus rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none transition-shadow min-h-[44px] text-text-main"
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-main mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2.5 bg-surface dark:bg-surface-hover border border-border-focus rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none min-h-[44px] text-text-main"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-text-main mb-1">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full p-2.5 bg-surface dark:bg-surface-hover border border-border-focus rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none min-h-[44px] text-text-main"
          >
            {sourceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-text-main mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full p-2.5 bg-surface dark:bg-surface-hover border border-border-focus rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none transition-shadow text-text-main resize-y"
          placeholder="Add any additional notes here..."
        ></textarea>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6 pb-2 md:pb-0">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 md:flex-none px-4 py-2 min-h-[44px] text-text-muted bg-surface border border-border-focus rounded-lg hover:bg-surface-hover dark:bg-surface dark:hover:bg-surface-hover transition-colors font-medium flex justify-center items-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 md:flex-none px-4 py-2 min-h-[44px] text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors font-medium flex justify-center items-center shadow-sm"
        >
          {initialData ? 'Save Changes' : 'Add Lead'}
        </button>
      </div>
    </form>
  );
}
