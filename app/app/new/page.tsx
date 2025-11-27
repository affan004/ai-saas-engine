"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// In a real app, this would be a Server Action in a separate file
// For now, we mock the triggering of the background job
async function triggerBuild(name: string, prompt: string) {
  // 1. Generate a URL-friendly slug (e.g. "Dentist App" -> "dentist-app")
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  
  // 2. Call our API route that triggers the Trigger.dev job
  // Note: You need to create this API route in the next step
  const res = await fetch("/api/trigger/build", {
    method: "POST",
    body: JSON.stringify({
      siteName: name,
      subdomain: slug,
      prompt: prompt,
    }),
  });

  if (!res.ok) throw new Error("Failed to trigger build");
  return { slug };
}

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const prompt = formData.get("prompt") as string;

    try {
      await triggerBuild(name, prompt);
      // Redirect back to dashboard to see the "Building..." status
      router.push("/"); 
    } catch (error) {
      console.error(error);
      alert("Failed to start build. Check console.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-6 flex items-center gap-4">
          <Link href="/app" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create New Project</h1>
            <p className="text-sm text-gray-500">Describe your idea, and AI will build it.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="e.g. Dentist CRM"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {/* AI Prompt */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700 mb-2">
              What should this app do?
            </label>
            <textarea
              name="prompt"
              id="prompt"
              required
              rows={4}
              placeholder="e.g. A landing page for a dental clinic with booking features, testimonials, and a pricing section."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Igniting Engines...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Website
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}