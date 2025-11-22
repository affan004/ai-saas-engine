import Link from "next/link";
import { Plus, ExternalLink, Github, Globe } from "lucide-react";

// MOCK DATA: In Phase 2, we will fetch this from Supabase
const projects = [
  {
    id: "1",
    name: "Dentist CRM",
    subdomain: "dentist-crm",
    status: "live",
    lastUpdated: "2 mins ago",
    repo: "github.com/user/dentist-crm",
  },
  {
    id: "2",
    name: "Marketing Blog",
    subdomain: "marketing-blog",
    status: "building",
    lastUpdated: "Just now",
    repo: "github.com/user/marketing-blog",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-500 mt-1">Manage and deploy your AI-generated apps.</p>
        </div>
        <Link
          href="/new"
          className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={18} />
          New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {project.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <a
                    href={`https://${project.subdomain}.vercel.app`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    {project.subdomain}.vercel.app
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>
            {/* ... rest of card ... */}
          </div>
        ))}

        {/* "New Project" Card */}
        <Link
          href="/new"
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer h-full min-h-[200px]"
        >
          <div className="h-12 w-12 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <span className="font-medium">Create new project</span>
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    live: "bg-green-100 text-green-700 border-green-200",
    building: "bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse",
    failed: "bg-red-100 text-red-700 border-red-200",
  };
  
  const labels = { live: "Live", building: "Building...", failed: "Failed" };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}