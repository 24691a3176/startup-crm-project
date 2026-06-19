import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const COLORS = [
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EF4444", // Red
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-xl">
        <p className="font-semibold">{data.stage}</p>
        <p className="text-sm font-medium mt-1">
          {data.value} Leads
        </p>
      </div>
    );
  }

  return null;
};

const FunnelChartCard = ({ data = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-[24px] border border-slate-100 dark:border-gray-700 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-shadow flex flex-col h-[400px] group"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Sales Funnel
        </h3>
      </div>

      <div className="flex-grow w-full h-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsFunnelChart>
              <Tooltip content={<CustomTooltip />} />

              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
                animationDuration={1200}
              >
                <LabelList
                  position="right"
                  dataKey="stage"
                  fill="#475569"
                  stroke="none"
                />

                <LabelList
                  position="center"
                  dataKey="value"
                  fill="#ffffff"
                  stroke="none"
                />

                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill || COLORS[index % COLORS.length]}
                    className="hover:brightness-110 hover:drop-shadow-lg transition-all duration-300"
                  />
                ))}
              </Funnel>
            </RechartsFunnelChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-medium">
            No funnel data available
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(FunnelChartCard);