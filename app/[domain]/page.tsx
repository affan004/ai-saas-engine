export default function UserAppPage({ params }: { params: { domain: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
        <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">
          Preview Mode
        </p>
        <h1 className="text-3xl font-bold text-gray-900">
          {params.domain}
        </h1>
        <p className="mt-4 text-gray-600">
          This is a user-generated application hosted on the platform.
        </p>
      </div>
    </div>
  );
}