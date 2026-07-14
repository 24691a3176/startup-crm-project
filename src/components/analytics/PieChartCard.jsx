import { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { STATUS_COLORS } from "../../constants/analyticsColors";

function PieChartCard({ data }) {
  const visibleData = data.filter((item) => item.value > 0);
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lead Status Distribution</h2>
      <p className="text-sm text-slate-500 dark:text-gray-400">Current pipeline composition</p>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={visibleData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
                {visibleData.map((item) => <Cell key={item.name} fill={STATUS_COLORS[item.name] || '#CBD5E1'} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${value} leads`, "Total"]} contentStyle={{ background: "var(--chart-tooltip-bg)", borderColor: "var(--chart-tooltip-border)", color: "var(--chart-tooltip-text)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {visibleData.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-5 text-xs">
              <span className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                <span className="size-2.5 rounded-full" style={{ background: STATUS_COLORS[item.name] || '#CBD5E1' }} />
                {item.name}
              </span>
              <strong className="text-slate-900 dark:text-white">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
export default memo(PieChartCard);