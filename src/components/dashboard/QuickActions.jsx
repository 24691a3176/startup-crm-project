import { PlusCircle, List, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../context/LeadContext";
import toast from "react-hot-toast";

export default function QuickActions() {
  const navigate = useNavigate();
  const { leads } = useLeads();

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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
        Quick Actions
      </h3>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/leads/new")}
          className="flex items-center w-full p-3 rounded-lg text-white transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] cursor-pointer"
          style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}
        >
          <PlusCircle size={20} className="mr-3" />
          <span className="font-medium">Add New Lead</span>
        </button>

        <button
          onClick={() => navigate("/leads")}
          className="flex items-center w-full p-3 rounded-lg text-white transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer"
          style={{ background: "#0F172A" }}
        >
          <List size={20} className="mr-3 text-slate-400" />
          <span className="font-medium">View All Leads</span>
        </button>

        <button
          onClick={handleExport}
          disabled={!leads || leads.length === 0}
          className={`flex items-center w-full p-3 rounded-lg text-white transition-all duration-200 transform ${
            !leads || leads.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer"
          }`}
          style={{ background: "#0F172A" }}
        >
          <Download size={20} className="mr-3 text-slate-400" />
          <span className="font-medium">Export Data</span>
        </button>
      </div>
    </div>
  );
}