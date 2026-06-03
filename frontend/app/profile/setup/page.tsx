export default function ProfileSetupPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Profile Setup
        </h1>

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Degree"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="University"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="number"
            placeholder="Graduation Year"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Current Skills (e.g. Python, SQL)"
            className="p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Target Role (e.g. Software Engineer)"
            className="p-3 rounded-lg bg-slate-800"
          />

          <button className="bg-blue-600 p-3 rounded-lg font-semibold">
            Generate My Career Roadmap
          </button>
        </div>
      </div>
    </main>
  );
}