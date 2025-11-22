// MOCK AI SERVICE
// This allows us to build the platform without spending money on API tokens.
// Later, we will switch this back to use the "Hybrid Architect/Intern" strategy.

const MOCK_GENERATED_CODE = `
import Link from "next/link";
import { ArrowRight, CheckCircle, Layout, Shield } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-xl text-gray-900">AppLaunch</span>
          </div>
          <div className="flex gap-4">
            <button className="text-gray-600 hover:text-gray-900 font-medium">Sign In</button>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8">
            Build your SaaS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              faster than ever.
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            The complete platform for building, deploying, and scaling your application. 
            Focus on your code, we handle the infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto h-12 px-8 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              Start Building Free <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto h-12 px-8 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Layout,
                title: "Modern Stack",
                desc: "Built on Next.js 14, Tailwind, and TypeScript. The best tools, pre-configured."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "SOC2 compliant infrastructure with automated backups and encryption at rest."
              },
              {
                icon: CheckCircle,
                title: "One-Click Deploy",
                desc: "Push to git and we handle the rest. Preview environments generated automatically."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
`;

export const ai = {
  // We keep the same function signature so we don't break the Trigger job
  generateLandingPage: async (userDescription: string) => {
    console.log("MOCK AI: Generating code for prompt:", userDescription);
    
    // Simulate network delay (1 second) to make it feel realistic
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return MOCK_GENERATED_CODE;
  },
};