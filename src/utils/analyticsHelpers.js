import { STATUS_COLORS } from '../constants/analyticsColors';

const safeLeads = (leads) => (Array.isArray(leads) ? leads : []);

export const getStatusDistribution = (leads) => {
  const data = safeLeads(leads);
  const statusCounts = data.reduce((acc, lead) => {
    const status = lead.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const total = data.length;
  return Object.entries(statusCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      fill: STATUS_COLORS[name] || '#CBD5E1',
    }))
    .sort((a, b) => b.value - a.value);
};

export const getMonthlyLeads = (leads) => {
  const data = safeLeads(leads);
  const months = {};
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    months[monthName] = 0;
  }

  data.forEach((lead) => {
    if (lead.createdAt) {
      const d = new Date(lead.createdAt);
      const monthName = d.toLocaleString('default', { month: 'short' });
      if (months[monthName] !== undefined) {
        months[monthName]++;
      }
    }
  });

  return Object.entries(months).map(([name, count]) => ({ name, count }));
};

export const getConversionByMonth = (leads) => {
  const data = safeLeads(leads);
  const monthsData = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    monthsData[monthName] = { won: 0, total: 0 };
  }

  data.forEach((lead) => {
    if (lead.createdAt) {
      const d = new Date(lead.createdAt);
      const monthName = d.toLocaleString('default', { month: 'short' });
      if (monthsData[monthName] !== undefined) {
        monthsData[monthName].total++;
        if (lead.status === 'Won') {
          monthsData[monthName].won++;
        }
      }
    }
  });

  return Object.entries(monthsData).map(([name, stats]) => ({
    name,
    rate: stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0,
  }));
};

export const getRevenueByMonth = (leads) => {
  const data = safeLeads(leads);
  const monthsData = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    monthsData[monthName] = 0;
  }

  data.forEach((lead) => {
    if (lead.status === 'Won' && lead.wonAt) {
      const d = new Date(lead.wonAt);
      const monthName = d.toLocaleString('default', { month: 'short' });
      if (monthsData[monthName] !== undefined) {
        monthsData[monthName] += Number(lead.value) || 0;
      }
    }
  });

  return Object.entries(monthsData).map(([name, revenue]) => ({ name, revenue }));
};

export const getPipelineValue = (leads) => {
  const data = safeLeads(leads);
  return data
    .filter((l) => !['Won', 'Lost'].includes(l.status))
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

export const getWonRevenue = (leads) => {
  const data = safeLeads(leads);
  return data
    .filter((l) => l.status === 'Won')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

export const getAverageSalesCycle = (leads) => {
  const data = safeLeads(leads);
  const wonLeads = data.filter((l) => l.status === 'Won' && l.createdAt && l.wonAt);
  
  if (wonLeads.length === 0) return 0;

  const totalDays = wonLeads.reduce((sum, l) => {
    const start = new Date(l.createdAt);
    const end = new Date(l.wonAt);
    const days = (end - start) / (1000 * 60 * 60 * 24);
    return sum + (days > 0 ? days : 0);
  }, 0);

  return Math.round(totalDays / wonLeads.length);
};

export const getLostRate = (leads) => {
  const data = safeLeads(leads);
  if (data.length === 0) return 0;
  const lostCount = data.filter((l) => l.status === 'Lost').length;
  return Math.round((lostCount / data.length) * 100);
};

export const getLeadSourceStats = (leads) => {
  const data = safeLeads(leads);
  const sources = data.reduce((acc, lead) => {
    const source = lead.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(sources)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getFunnelData = (leads) => {
  const data = safeLeads(leads);
  
  const counts = data.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // For funnel, each stage encompasses all subsequent stages
  const wonCount = counts['Won'] || 0;
  const proposalCount = (counts['Proposal'] || counts['Proposal Sent'] || 0) + wonCount;
  const meetingCount = (counts['Meeting'] || counts['Meeting Scheduled'] || 0) + proposalCount;
  const contactedCount = (counts['Contacted'] || 0) + meetingCount;
  const newCount = (counts['New'] || 0) + contactedCount;

  return [
    { stage: 'New', value: newCount, fill: STATUS_COLORS['New'] || '#94A3B8' },
    { stage: 'Contacted', value: contactedCount, fill: STATUS_COLORS['Contacted'] || '#2563EB' },
    { stage: 'Meeting', value: meetingCount, fill: STATUS_COLORS['Meeting'] || '#F59E0B' },
    { stage: 'Proposal', value: proposalCount, fill: STATUS_COLORS['Proposal'] || '#7C3AED' },
    { stage: 'Won', value: wonCount, fill: STATUS_COLORS['Won'] || '#22C55E' },
  ].filter(d => d.value > 0);
};

export const getSalesVelocity = (leads) => {
  const data = safeLeads(leads);
  if (data.length === 0) return 0;

  const wonLeads = data.filter((l) => l.status === 'Won');
  const winRate = wonLeads.length / data.length;
  
  const avgDealSize = wonLeads.length > 0 
    ? wonLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0) / wonLeads.length
    : 0;

  const avgSalesCycle = getAverageSalesCycle(data);
  const cycleDays = avgSalesCycle > 0 ? avgSalesCycle : 1;

  const velocity = (data.length * winRate * avgDealSize) / cycleDays;
  return Math.round(velocity);
};

export const getForecastRevenue = (leads) => {
  const data = safeLeads(leads);
  const revenueByMonth = getRevenueByMonth(data);
  
  if (revenueByMonth.length === 0) return 0;

  const total = revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);
  return Math.round(total / revenueByMonth.length);
};

export const getTopPerformers = (leads) => {
  const data = safeLeads(leads);
  const repRevenue = data
    .filter((l) => l.status === 'Won')
    .reduce((acc, lead) => {
      const owner = lead.owner || 'Unassigned';
      acc[owner] = (acc[owner] || 0) + (Number(lead.value) || 0);
      return acc;
    }, {});

  return Object.entries(repRevenue)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

export const getActivityHeatmapData = (leads) => {
  const data = safeLeads(leads);
  const heatmap = {};

  data.forEach(lead => {
    if (lead.createdAt) {
      const dateStr = new Date(lead.createdAt).toISOString().split('T')[0];
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
    }
  });

  return Object.entries(heatmap).map(([date, count]) => ({ date, count }));
};
