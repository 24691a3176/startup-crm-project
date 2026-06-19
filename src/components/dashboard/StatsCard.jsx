/**
 * A card component displaying a key statistic.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the statistic (e.g., "Total Leads").
 * @param {string|number} props.value - The current value of the statistic.
 * @param {React.ReactNode} props.icon - The Lucide React icon element to display.
 * @param {number} props.change - The percentage change compared to the previous period.
 * @param {string} [props.color="blue"] - The base color theme for the card icon and change text ("blue", "green", "amber", "red").
 * @returns {JSX.Element} The rendered StatsCard component.
 */
export default function StatsCard({ title, value, icon, change, color = "blue" }) {
  const isPositive = change >= 0;
  
  // Tailwind classes mapping to user's color palette
  // Primary #2563EB -> blue-600
  // Success #22C55E -> green-500
  // Warning #F59E0B -> amber-500
  // Danger #EF4444 -> red-500
  const colorMap = {
    blue: { iconBg: "bg-blue-100", iconText: "text-blue-600" },
    green: { iconBg: "bg-green-100", iconText: "text-green-500" },
    amber: { iconBg: "bg-amber-100", iconText: "text-amber-500" },
    red: { iconBg: "bg-red-100", iconText: "text-red-500" }
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${selectedColor.iconBg} ${selectedColor.iconText}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-semibold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-slate-400 ml-2">vs last month</span>
      </div>
    </div>
  );
}
