import Link from "next/link";
import { Plus, ExternalLink, Globe } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

// Force dynamic rendering so we see new projects instantly

export default async function DashboardPage() {
  // FETCH REAL DATA
  const { data: projects, error } = await supabaseAdmin
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error);
  }

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
        {/* Show projects if they exist */}
        {projects?.map((project) => (
          <div
            key={project.id}
            className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                  {project.name ? project.name[0] : "A"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <a
                    href={project.custom_domain ? `https://${project.custom_domain}` : `http://${project.slug}.localhost:3000`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    {project.slug}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border bg-green-100 text-green-700 border-green-200">
                Active
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <span className="text-xs text-gray-400">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <Globe size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* "Create New" Card */}
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