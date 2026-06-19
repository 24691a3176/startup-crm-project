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
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-2.5 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-shadow min-h-[44px] text-slate-900 dark:text-white ${
            errors.name ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-gray-600'
          }`}
          placeholder="e.g. Jane Doe"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Company *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={`w-full p-2.5 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-shadow min-h-[44px] text-slate-900 dark:text-white ${
            errors.company ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-gray-600'
          }`}
          placeholder="e.g. Acme Corp"
        />
        {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2.5 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-shadow min-h-[44px] text-slate-900 dark:text-white ${
            errors.email ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-gray-600'
          }`}
          placeholder="jane@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-shadow min-h-[44px] text-slate-900 dark:text-white"
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none min-h-[44px] text-slate-900 dark:text-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none min-h-[44px] text-slate-900 dark:text-white"
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
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-shadow text-slate-900 dark:text-white resize-y"
          placeholder="Add any additional notes here..."
        ></textarea>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-700 mt-6 pb-2 md:pb-0">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 md:flex-none px-4 py-2 min-h-[44px] text-slate-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors font-medium flex justify-center items-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 md:flex-none px-4 py-2 min-h-[44px] text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium flex justify-center items-center shadow-sm"
        >
          {initialData ? 'Save Changes' : 'Add Lead'}
        </button>
      </div>
    </form>
  );
}
