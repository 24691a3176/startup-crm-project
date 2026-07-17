import { PlusCircle, List, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../context/LeadContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

export default function QuickActions() {
  const navigate = useNavigate();
  const { leads } = useLeads();
  const { isDarkMode } = useTheme();

  const handleExport = () => {
    try {
      if (!leads || leads.length === 0) {
        toast.error("No data to export", { style: { border: "1px solid #EF4444", color: "#EF4444" } });
        return;
      }
      
      const headers = ["Lead Name", "Company", "Email", "Phone", "Status", "Date Added"];
      
      const csvRows = leads.map(lead => {
        const date = lead.createdAt || lead.dateAdded;
        const dateString = date ? new Date(date).toLocaleDateString("en-US") : "N/A";
        return [
          `"${lead.name || ""}"`,
          `"${lead.company || ""}"`,
          `"${lead.email || ""}"`,
          `"${lead.phone || ""}"`,
          `"${lead.status || ""}"`,
          `"${dateString}"`
        ];
      });

      const csvContent = [
        headers.join(","),
        ...csvRows.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `leads_export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Leads exported successfully", { style: { border: "1px solid #22C55E", color: "#16a34a" } });
    } catch (error) {
      toast.error("Failed to export leads", { style: { border: "1px solid #EF4444", color: "#EF4444" } });
      console.error("Export error:", error);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
      <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">
        Quick Actions
      </h3>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/leads/new")}
          className="flex items-center w-full p-3 rounded-lg text-white transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(114,195,138,0.5)] cursor-pointer"
          style={{ background: "linear-gradient(135deg, #5A3AA3, #6B46C1)" }}
        >
          <PlusCircle size={20} className="mr-3" />
          <span className="font-medium">Add New Lead</span>
        </button>

        <button
          onClick={() => navigate("/leads")}
          className={`flex items-center w-full p-3 rounded-lg border transition-all duration-300 ease-in-out transform cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(114,195,138,0.3)] ${
            isDarkMode
              ? 'bg-background text-white border-border hover:bg-surface-hover'
              : 'bg-surface text-text-main border-border hover:bg-surface-hover'
          }`}
        >
          <List size={20} className={`mr-3 ${isDarkMode ? 'text-text-subtle' : 'text-text-main'}`} />
          <span className="font-medium">View All Leads</span>
        </button>

        <button
          onClick={handleExport}
          disabled={!leads || leads.length === 0}
          className={`flex items-center w-full p-3 rounded-lg border transition-all duration-300 ease-in-out transform ${
            isDarkMode
              ? 'bg-background text-white border-border'
              : 'bg-surface text-text-main border-border'
          } ${
            !leads || leads.length === 0
              ? 'opacity-50 cursor-not-allowed'
              : `cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(114,195,138,0.3)] ${
                  isDarkMode ? 'hover:bg-surface-hover' : 'hover:bg-surface-hover'
                }`
          }`}
        >
          <Download size={20} className={`mr-3 ${isDarkMode ? 'text-text-subtle' : 'text-text-main'}`} />
          <span className="font-medium">Export Data</span>
        </button>
      </div>
    </div>
  );
}