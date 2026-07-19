"use client";
import {
  FileText,
  Bot,
  Route,
  Mic,
  TrendingUp,
  History,
  LogOut,
  Trophy,
  Briefcase,
  BriefcaseBusiness,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

    const [user, setUser] = useState<any>(null);
    const careerTips = [
  "Build real-world projects and showcase them on GitHub.",
  "Practice at least one DSA problem every day to improve problem-solving.",
  "Tailor your resume for every job application you submit.",
  "Keep your LinkedIn profile updated with your latest projects and skills.",
  "Focus on mastering one technology stack instead of learning many at once.",
  "Contribute to open-source projects to gain practical experience.",
  "Practice mock interviews regularly to build confidence.",
];
const [careerTip, setCareerTip] = useState("");

  useEffect(() => {
  const initializeDashboard = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);


      if (!user) {
        router.push("/login");
        return;
      }

     
      const response = await fetch(
        "/api/dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      const data = await response.json();


      setDashboard(data);
      setCareerTip(
  careerTips[
    Math.floor(Math.random() * careerTips.length)
  ]
);
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  initializeDashboard();
}, [router]);

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};

if (loading) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <h1 className="text-2xl font-bold">
        Loading Dashboard...
      </h1>
    </main>
  );
}

  const roadmapScore =
    dashboard?.roadmap?.score ?? 0;

  const resumeScore =
    dashboard?.resume?.score ?? 0;

  const careerScore =
    Math.round(
      (roadmapScore + resumeScore) / 2
    );

  const targetRole =
    dashboard?.roadmap?.role ??
    "Not Set";

  const interviewCount =
    dashboard?.interview ? 1 : 0;

  const progress =
    dashboard?.progress ?? 0;
const hour = new Date().getHours();

const greeting =
  hour < 12
    ? "Good Morning ☀️"
    : hour < 18
    ? "Good Afternoon 🌤️"
    : "Good Evening 🌙";
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-3 mb-2">
  <h1 className="text-4xl font-bold">
    {greeting}
  </h1>

  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
    AI Powered
  </span>
</div>

<p className="text-gray-300 text-lg">
  Welcome back,{" "}
  <span className="font-semibold text-white">
    {user?.email?.split("@")[0]}
  </span>
</p>

<p className="text-gray-500 mt-1">
  Your AI-powered career development dashboard
</p>
          <div className="flex items-center gap-4">
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl transition-all duration-300 hover:scale-105"
  >
    <LogOut className="w-5 h-5" />
    Logout
  </button>
</div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
<div className="bg-slate-900 border-l-4 border-blue-500 p-6 rounded-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
  <div className="flex items-center justify-between">
    <h2 className="text-gray-400">
      Career Score
    </h2>

    <Trophy className="w-7 h-7 text-blue-400" />
  </div>

  <div className="flex justify-center mt-6">
    <div className="relative w-28 h-28">

      <svg
        className="w-28 h-28 -rotate-90"
        viewBox="0 0 120 120"
      >
        {/* Background Circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#1e293b"
          strokeWidth="10"
          fill="none"
        />

        {/* Progress Circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#3b82f6"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={314}
          strokeDashoffset={314 - (314 * careerScore) / 100}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">
          {careerScore}
        </span>
      </div>

    </div>
  </div>
</div>
          <div className="bg-slate-900 border-l-4 border-green-500 p-6 rounded-xl hover:shadow-lg hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 hover:scale-[1.02] transition">
  <div className="flex items-center justify-between">
    <h2 className="text-gray-400">
      Resume Score
    </h2>

    <FileText className="w-7 h-7 text-green-400" />
  </div>

  <p className="text-5xl font-bold mt-4">
    {resumeScore}/100
  </p>
</div>

          <div className="bg-slate-900 border-l-4 border-orange-500 p-6 rounded-xl hover:shadow-lg hover:shadow-orange-500/10 transition">
  <div className="flex items-center justify-between">
    <h2 className="text-gray-400">
      Interviews Completed
    </h2>

    <Mic className="w-7 h-7 text-orange-400" />
  </div>

  <p className="text-5xl font-bold mt-4">
    {interviewCount}
  </p>
</div>

          <div className="bg-slate-900 border-l-4 border-cyan-500 p-6 rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition">
  <div className="flex items-center justify-between">
    <h2 className="text-gray-400">
      Roadmap Progress
    </h2>

    <TrendingUp className="w-7 h-7 text-cyan-400" />
  </div>

  <p className="text-5xl font-bold mt-4">
    {progress}%
  </p>
  <div className="w-full bg-slate-800 rounded-full h-3 mt-6 overflow-hidden">
  <div
    className="bg-cyan-400 h-3 rounded-full transition-all duration-700"
    style={{ width: `${progress}%` }}
  ></div>
</div>

<p className="text-right text-sm text-gray-400 mt-2">
  {progress}% Complete
</p>
</div>

          </div>

        </div>
{/* Statistics Cards */}

<h2 className="text-3xl font-bold mt-10 mb-6">
  🚀 Quick Actions
</h2>

  <div className="grid md:grid-cols-3 gap-6 mb-10">

  <div
  onClick={() => router.push("/resume")}
  className="bg-slate-900 border border-slate-800 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:scale-[1.02] p-6 rounded-xl cursor-pointer transition-all duration-300 group"
>
  <div className="flex items-center justify-between mb-5">
    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg shadow-blue-500/20">
  <FileText className="w-7 h-7 text-white" />
</div>

    <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
      →
    </span>
  </div>

  <h3 className="text-xl font-semibold mb-2">
    Resume Analysis
  </h3>

  <p className="text-gray-400 text-sm">
    Upload your resume and receive AI-powered feedback with improvement suggestions.
  </p>
</div>

  <div
  onClick={() => router.push("/chat")}
  className="bg-slate-900 border border-slate-800 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10 p-6 rounded-xl cursor-pointer transition-all duration-300 group"
>
  <div className="flex items-center justify-between mb-5">
  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg shadow-green-500/20">
  <Bot className="w-7 h-7 text-white" />
</div>

    <span className="text-green-400 group-hover:translate-x-1 transition-transform">
      →
    </span>
  </div>

  <h3 className="text-xl font-semibold mb-2">
    AI Career Chat
  </h3>

  <p className="text-gray-400 text-sm">
    Get instant career guidance, interview tips, and learning advice.
  </p>
</div>
<div
  onClick={() => router.push("/job-matcher")}
  className="bg-slate-900 border border-slate-800 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-2 hover:scale-[1.02] p-6 rounded-xl cursor-pointer transition-all duration-300 group"
>
  <div className="flex items-center justify-between mb-5">
    <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl shadow-lg shadow-pink-500/20">
      <BriefcaseBusiness className="w-7 h-7 text-white" />
    </div>

    <span className="text-pink-400 group-hover:translate-x-1 transition-transform">
      →
    </span>
  </div>

  <h3 className="text-xl font-semibold mb-2">
    Job Matcher
  </h3>

  <p className="text-gray-400 text-sm">
    Compare your resume with any job description using AI and receive ATS score, skill gap analysis, and personalized recommendations.
  </p>
</div>

  <div
  onClick={() => router.push("/roadmap")}
  className="bg-slate-900 border border-slate-800 hover:border-purple-500 hover:shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 hover:scale-[1.02] p-6 rounded-xl cursor-pointer transition-all duration-300 group"
>
  <div className="flex items-center justify-between mb-5">
    <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-3 rounded-xl shadow-lg shadow-purple-500/20">
  <Route className="w-7 h-7 text-white" />
</div>

    <span className="text-purple-400 group-hover:translate-x-1 transition-transform">
      →
    </span>
  </div>

  <h3 className="text-xl font-semibold mb-2">
    Generate Roadmap
  </h3>

  <p className="text-gray-400 text-sm">
    Create a personalized AI-powered learning roadmap tailored to your career goals and current skills.
  </p>
</div>

  <div
  onClick={() => router.push("/interview")}
  className="bg-slate-900 border border-slate-800 hover:border-orange-500 hover:shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 hover:scale-[1.02] p-6 rounded-xl cursor-pointer transition-all duration-300 group"
>
  <div className="flex items-center justify-between mb-5">
    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg shadow-orange-500/20">
  <Mic className="w-7 h-7 text-white" />
</div>

    <span className="text-orange-400 group-hover:translate-x-1 transition-transform">
      →
    </span>
  </div>

  <h3 className="text-xl font-semibold mb-2">
    Mock Interview
  </h3>

  <p className="text-gray-400 text-sm">
    Practice technical and HR interviews with AI-generated questions.
  </p>
</div>

  <div
  onClick={() => router.push("/roadmap-progress")}
  className="bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 p-6 rounded-xl cursor-pointer transition-all duration-300 group"
>
  <div className="flex items-center justify-between mb-5">
    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg shadow-emerald-500/20">
  <TrendingUp className="w-7 h-7 text-white" />
</div>

    <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">
      →
    </span>
  </div>

  <h3 className="text-xl font-semibold mb-2">
    Progress Tracker
  </h3>

  <p className="text-gray-400 text-sm">
    Monitor your roadmap completion and track your learning progress.
  </p>
</div>

  <div
  onClick={() => router.push("/roadmap-history")}
  className="bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 hover:scale-[1.02] p-6 rounded-xl cursor-pointer transition-all duration-300 group"
>
  <div className="flex items-center justify-between mb-5">
    <div className="bg-gradient-to-br from-cyan-500 to-sky-500 p-3 rounded-xl shadow-lg shadow-cyan-500/20">
  <History className="w-7 h-7 text-white" />
</div>

    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
      →
    </span>
  </div>

  <h3 className="text-xl font-semibold mb-2">
    Roadmap History
  </h3>

  <p className="text-gray-400 text-sm">
    View all previously generated career roadmaps and revisit your plans.
  </p>
</div>

<div
  onClick={() => router.push("/job-matcher-history")}
  className="bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 hover:scale-[1.02] p-6 rounded-xl cursor-pointer transition-all duration-300 group"
>
  <div className="flex items-center justify-between mb-5">
    <div className="bg-gradient-to-br from-cyan-500 to-sky-500 p-3 rounded-xl shadow-lg shadow-cyan-500/20">
  <History className="w-7 h-7 text-white" />
</div>

    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
      →
    </span>
  </div>

  <h3 className="text-xl font-semibold mb-2">
    Job Matcher History
  </h3>

  <p className="text-gray-400 text-sm">
    View all your previous AI job match analyses, ATS scores, and recommendations.
  </p>
</div>

  ...
</div>
        <div className="mt-8 bg-slate-900 p-6 rounded-xl">

          <h2 className="text-2xl font-bold mb-4">
            Latest Activity
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

  <div className="bg-slate-800 rounded-xl p-5">
    <h3 className="text-lg font-semibold mb-2">
      📄 Resume Analysis
    </h3>

    <p className="text-3xl font-bold">
      {resumeScore}/100
    </p>

    <p className="text-gray-400 text-sm mt-2">
      Latest Resume Score
    </p>
  </div>

  <div className="bg-slate-800 rounded-xl p-5">
    <h3 className="text-lg font-semibold mb-2">
      🗺️ Current Roadmap
    </h3>

    <p className="text-xl font-bold">
      {targetRole}
    </p>

    <p className="text-gray-400 text-sm mt-2">
      Active Learning Goal
    </p>
  </div>

  <div className="bg-slate-800 rounded-xl p-5">
    <h3 className="text-lg font-semibold mb-2">
      🎤 Interview
    </h3>

    <p className="text-xl font-bold">
      {dashboard?.interview ? "Completed" : "Not Attempted"}
    </p>

    <p className="text-gray-400 text-sm mt-2">
      AI Mock Interview
    </p>
  </div>

  <div className="bg-slate-800 rounded-xl p-5">
    <h3 className="text-lg font-semibold mb-2">
      📈 Progress
    </h3>

    <p className="text-3xl font-bold">
      {progress}%
    </p>

    <p className="text-gray-400 text-sm mt-2">
      Roadmap Completion
    </p>
  </div>

</div>
</div> {/* End of Latest Activity */}

<div className="mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl border border-white/10 hover:scale-[1.01] transition-all duration-300">
  <h2 className="text-2xl font-bold mb-3">
    💡 Career Tip of the Day
  </h2>

  <p className="text-gray-100 leading-7 text-lg">
  {careerTip}
</p>
</div>
<div className="mt-10 flex flex-col md:flex-row justify-between items-center border-t border-slate-800 pt-6 text-gray-400 text-sm">

  <p>
    © {new Date().getFullYear()} CareerForge AI. All rights reserved.
  </p>

  <div className="flex gap-6 mt-3 md:mt-0">

    <span className="hover:text-white transition cursor-pointer">
      Privacy
    </span>

    <span className="hover:text-white transition cursor-pointer">
      Terms
    </span>

    <span className="hover:text-white transition cursor-pointer">
      Support
    </span>

  </div>

</div>
</main>

);
}