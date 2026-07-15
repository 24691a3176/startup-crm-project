import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List as ListIcon, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import LeadTable from '../components/leads/LeadTable';
import LeadCard from '../components/leads/LeadCard';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import { useLeads } from '../context/LeadContext';

/**
 * The main Leads page orchestrating the Lead CRUD operations.
 *
 * @returns {JSX.Element} The rendered Leads page.
 */
export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (location.pathname === '/leads/new') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedLead(null);
      setIsModalOpen(true);
    } else if (location.state?.editLead) {
      setSelectedLead(location.state.editLead);
      setIsModalOpen(true);
      // Clean up state so a refresh doesn't reopen the modal
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.pathname === '/leads' && !selectedLead) {
      setIsModalOpen(false);
    }
  }, [location.pathname, location.state, navigate, selectedLead]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (location.pathname === '/leads/new') {
      navigate('/leads', { replace: true });
    }
  };

  const filteredLeads = leads
    .filter(lead => activeFilter === 'All' || lead.status === activeFilter)
    .filter(lead =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAddClick = () => {
    navigate('/leads/new');
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(leadId);
    }
  };

  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // MongoDB returns _id, not id. Use _id with fallback to id for safety.
      const leadId = selectedLead._id || selectedLead.id;
      updateLead(leadId, formData);
    } else {
      addLead(formData);
    }
    handleModalClose();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 w-full transition-colors duration-200">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Lead Management</h1>
            <p className="text-slate-500 dark:text-gray-400 mt-1">View, track, and manage all your inbound leads.</p>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* View Toggle - visible primarily on tablet (hidden on mobile and desktop) */}
            <div className="hidden md:flex lg:hidden items-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${viewMode === 'table' ? 'bg-slate-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:text-gray-300 dark:hover:text-gray-300'}`}
                aria-label="Table View"
              >
                <ListIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${viewMode === 'card' ? 'bg-slate-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:text-gray-300 dark:hover:text-gray-300'}`}
                aria-label="Card View"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            
            <button
              onClick={handleAddClick}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm min-h-[44px]"
            >
              <Plus size={20} className="mr-2" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 transition-colors duration-200">
            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* On mobile, always show cards. On larger screens, respect viewMode and breakpoint rules */}
          <div className="block md:hidden space-y-4">
            {filteredLeads.map((lead) => (
              <LeadCard key={`mobile-${lead.id}`} lead={lead} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            ))}
            {filteredLeads.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
                <EmptyState totalLeads={leads.length} onClearFilters={() => { setSearchQuery(''); setActiveFilter('All'); }} />
              </div>
            )}
          </div>
          
          <div className="hidden md:block">
            {/* Table view is forced on lg (desktop), and shown on md (tablet) if viewMode is table */}
            <div className={`${viewMode === 'table' ? 'block' : 'hidden lg:block'}`}>
              {filteredLeads.length > 0 ? (
                <LeadTable leads={filteredLeads} onEdit={handleEditClick} onDelete={handleDeleteClick} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
                  <EmptyState totalLeads={leads.length} onClearFilters={() => { setSearchQuery(''); setActiveFilter('All'); }} />
                </div>
              )}
            </div>

            {/* Card view is shown on md (tablet) if viewMode is card, hidden on lg (desktop) */}
            <div className={`${viewMode === 'card' ? 'block lg:hidden' : 'hidden'}`}>
              <div className="grid grid-cols-2 gap-4">
                {filteredLeads.map((lead) => (
                  <LeadCard key={`tablet-${lead.id}`} lead={lead} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                ))}
                {filteredLeads.length === 0 && (
                  <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
                    <EmptyState totalLeads={leads.length} onClearFilters={() => { setSearchQuery(''); setActiveFilter('All'); }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-none md:rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col h-full md:h-auto md:max-h-[90vh] transition-colors duration-200">
            <div className="flex justify-between items-center p-4 md:p-5 border-b border-slate-100 dark:border-gray-700 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {selectedLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:text-gray-300 dark:hover:text-gray-300 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 md:p-5 overflow-y-auto flex-1">
              <LeadForm 
                initialData={selectedLead} 
                onSubmit={handleFormSubmit} 
                onCancel={handleModalClose} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
