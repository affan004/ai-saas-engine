import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
        Build your app in <span className="text-blue-600">one click.</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        The AI-powered engine that writes code, deploys infrastructure, 
        and provisions emails automatically.
      </p>
      <div className="flex gap-4">
        <Link 
          href="http://app.localhost:3000" 
          className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}