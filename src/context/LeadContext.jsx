import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { leadService } from '../services/leadService';
import toast from 'react-hot-toast';

export const LeadContext = createContext(null);

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type) => {
    const newNotif = {
      id: crypto.randomUUID(),
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads(params);
      setLeads(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLead = useCallback(async (formData) => {
    setIsLoading(true);
    try {
      const res = await leadService.createLead(formData);
      setLeads((prev) => [res.data, ...prev]);
      addNotification(`New lead added: ${res.data.name}`, 'add');
      toast.success('Lead created successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.message || 
        'Failed to create lead'
      );
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const updateLead = useCallback(async (id, changes) => {
    setIsLoading(true);
    try {
      const res = await leadService.updateLead(id, changes);
      const updatedLead = res.data;
      
      setLeads((prev) => {
        const oldLead = prev.find(l => String(l.id) === String(id) || String(l._id) === String(id));
        if (oldLead && changes.status && oldLead.status !== changes.status) {
          if (changes.status === 'Won') {
            addNotification(`Lead converted: ${updatedLead.name}`, 'convert');
          } else if (changes.status === 'Lost') {
            addNotification(`Lead lost: ${updatedLead.name}`, 'loss');
          } else {
            addNotification(`Lead updated: ${updatedLead.name}`, 'update');
          }
        } else if (oldLead) {
          addNotification(`Lead updated: ${updatedLead.name}`, 'update');
        }
        return prev.map((l) => (String(l.id) === String(id) || String(l._id) === String(id) ? updatedLead : l));
      });
      toast.success('Lead updated successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.message || 
        'Failed to update lead'
      );
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const deleteLead = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => String(l.id) !== String(id) && String(l._id) !== String(id)));
      toast.success('Lead deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLeadById = useCallback(
    (id) => leads.find((l) => String(l.id) === String(id) || String(l._id) === String(id)),
    [leads]
  );

  const value = {
    leads,
    isLoading,
    pagination,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    getLeadById,
    notifications,
    markNotificationsAsRead,
    clearNotifications,
  };

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLeads() {
  const ctx = useContext(LeadContext);
  if (ctx === null) {
    throw new Error('useLeads must be called inside a LeadProvider');
  }
  return ctx;
}
