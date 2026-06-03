export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-500">
          CareerForge AI
        </h1>

        <div className="flex gap-6 text-gray-300">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">About</a>
          <a href="#">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-7xl font-bold mb-8">
          Build Your Dream Career with AI
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Personalized career roadmaps, resume analysis,
          interview preparation, and AI-powered guidance
          for students and freshers.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold">
            Get Started Free
          </button>

          <button className="border border-slate-700 px-8 py-4 rounded-xl">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">
              Career Roadmaps
            </h3>
            <p className="text-gray-400">
              Personalized plans to achieve your dream job.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">
              Resume Analysis
            </h3>
            <p className="text-gray-400">
              Improve ATS score and stand out.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">
              Interview Prep
            </h3>
            <p className="text-gray-400">
              Practice with AI-powered mock interviews.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}