import { useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
} from '../utils/analyticsHelpers';

export function useAnalytics(dateFilter = 'last90') {
  const { leads } = useLeads();

  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    const now = new Date();
    let cutoff;

    switch (dateFilter) {
      case 'last7':
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30':
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last90':
        cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'thisYear':
        cutoff = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
      case 'all':
      default:
        return leads;
    }

    return leads.filter((lead) => {
      if (!lead.createdAt) return false;
      return new Date(lead.createdAt) >= cutoff;
    });
  }, [leads, dateFilter]);

  const metrics = useMemo(() => ({
    totalLeads: filteredLeads.length,
    statusDistribution: getStatusDistribution(filteredLeads),
    monthlyLeads: getMonthlyLeads(filteredLeads),
    conversionTrend: getConversionByMonth(filteredLeads),
    revenueByMonth: getRevenueByMonth(filteredLeads),
    pipelineValue: getPipelineValue(filteredLeads),
    wonRevenue: getWonRevenue(filteredLeads),
    averageSalesCycle: getAverageSalesCycle(filteredLeads),
    lostRate: getLostRate(filteredLeads),
    leadSources: getLeadSourceStats(filteredLeads),
    funnelData: getFunnelData(filteredLeads),
    salesVelocity: getSalesVelocity(filteredLeads),
    forecast: getForecastRevenue(filteredLeads),
    topPerformers: getTopPerformers(filteredLeads),
    heatmapData: getActivityHeatmapData(filteredLeads),
  }), [filteredLeads]);

  return {
    metrics,
    totalLeads: filteredLeads.length,
    isLoading: false,
  };
}
