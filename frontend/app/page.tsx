"use client";
import Link from "next/link";
import {
  Route,
  FileText,
  Mic,
} from "lucide-react";
import { motion } from "framer-motion";
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-500">
          CareerForge AI
        </h1>

        <div className="flex items-center gap-8">

  <a
    href="#features"
    className="text-gray-300 hover:text-white transition"
  >
    Features
  </a>

  <a
    href="#how-it-works"
    className="text-gray-300 hover:text-white transition"
  >
    How it Works
  </a>

  <Link href="/login">
    <button className="border border-slate-700 hover:border-blue-500 hover:bg-slate-900 transition-all duration-300 px-5 py-2 rounded-lg">
      Login
    </button>
  </Link>

  <Link href="/register">
    <button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-5 py-2 rounded-lg font-semibold">
      Get Started
    </button>
  </Link>

</div>
      </nav>

      {/* Hero Section */}
      <motion.section
  className="max-w-6xl mx-auto px-6 py-24 text-center"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-5 py-2 rounded-full text-sm font-medium mb-8">
  🚀 AI-Powered Career Development Platform
</div>
        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-8">
  Launch Your
  <span className="text-blue-500"> Dream Career </span>
  with AI
</h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
  Accelerate your career with AI-powered resume analysis,
  personalized learning roadmaps, mock interviews, and an
  intelligent career assistant—all in one platform.
</p>

       <div className="flex flex-col sm:flex-row justify-center gap-5">

  <Link href="/register">
    <button className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/20 px-10 py-4 rounded-xl font-semibold text-lg">
      🚀 Get Started Free
    </button>
  </Link>

  <Link href="/login">
    <button className="border border-slate-700 hover:border-blue-500 hover:bg-slate-900 transition-all duration-300 px-10 py-4 rounded-xl font-semibold text-lg">
      Login →
    </button>
  </Link>

</div>
      </motion.section>
      <motion.section
  className="max-w-6xl mx-auto px-6 pb-20"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500 transition-all duration-300">
      <h3 className="text-4xl font-bold text-blue-500">
        24/7
      </h3>
      <p className="text-gray-400 mt-2">
        AI Career Assistant
      </p>
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-green-500 transition-all duration-300">
      <h3 className="text-4xl font-bold text-green-500">
        95%
      </h3>
      <p className="text-gray-400 mt-2">
        ATS Resume Optimization
      </p>
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-purple-500 transition-all duration-300">
      <h3 className="text-4xl font-bold text-purple-500">
        6+
      </h3>
      <p className="text-gray-400 mt-2">
        AI Career Tools
      </p>
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-orange-500 transition-all duration-300">
      <h3 className="text-4xl font-bold text-orange-500">
        100%
      </h3>
      <p className="text-gray-400 mt-2">
        Personalized Learning
      </p>
    </div>

  </div>
</motion.section>

      {/* Features */}
     <motion.section
  id="features"
  className="max-w-6xl mx-auto px-6 py-20"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  <h2 className="text-4xl font-bold text-center mb-12">
    Features
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {/* Roadmaps */}
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      className="bg-slate-900 border border-slate-800 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 p-8 rounded-2xl"
    >
      <div className="bg-purple-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
        <Route className="w-7 h-7 text-purple-400" />
      </div>

      <h3 className="text-2xl font-bold mb-3">
        Career Roadmaps
      </h3>

      <p className="text-gray-400 leading-7">
        Generate personalized AI-powered learning roadmaps tailored to your skills and career goals.
      </p>
    </motion.div>

    {/* Resume */}
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      className="bg-slate-900 border border-slate-800 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 p-8 rounded-2xl"
    >
      <div className="bg-green-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
        <FileText className="w-7 h-7 text-green-400" />
      </div>

      <h3 className="text-2xl font-bold mb-3">
        Resume Analysis
      </h3>

      <p className="text-gray-400 leading-7">
        Analyze your resume with AI, improve ATS compatibility, and receive actionable suggestions to stand out.
      </p>
    </motion.div>

    {/* Interview */}
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      className="bg-slate-900 border border-slate-800 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 p-8 rounded-2xl"
    >
      <div className="bg-orange-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
        <Mic className="w-7 h-7 text-orange-400" />
      </div>

      <h3 className="text-2xl font-bold mb-3">
        AI Mock Interviews
      </h3>

      <p className="text-gray-400 leading-7">
        Practice technical and HR interviews with AI-generated questions, instant feedback, and personalized improvement suggestions.
      </p>
    </motion.div>

  </div>
</motion.section>
      {/* How It Works */}
<section
  id="how-it-works"
  className="max-w-6xl mx-auto px-6 py-24"
>

  <h2 className="text-5xl font-bold text-center mb-4">
    How CareerForge AI Works
  </h2>

  <p className="text-center text-gray-400 max-w-3xl mx-auto mb-16">
    Get career-ready in three simple steps with AI-powered guidance.
  </p>

  <div className="grid md:grid-cols-3 gap-8">

  {/* Step 1 */}
  <motion.div
    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0 }}
  >
    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
      1
    </div>

    <h3 className="text-2xl font-bold mb-4">
      Create Your Profile
    </h3>

    <p className="text-gray-400 leading-7">
      Sign up, choose your target role, current skills, and career goals to get a personalized AI experience.
    </p>
  </motion.div>

  {/* Step 2 */}
  <motion.div
    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-green-500 hover:-translate-y-2 transition-all duration-300"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
      2
    </div>

    <h3 className="text-2xl font-bold mb-4">
      Get AI Guidance
    </h3>

    <p className="text-gray-400 leading-7">
      Generate personalized roadmaps, analyze your resume, chat with AI, and practice mock interviews with instant feedback.
    </p>
  </motion.div>

  {/* Step 3 */}
  <motion.div
    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-purple-500 hover:-translate-y-2 transition-all duration-300"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
      3
    </div>

    <h3 className="text-2xl font-bold mb-4">
      Land Your Dream Job
    </h3>

    <p className="text-gray-400 leading-7">
      Track your progress, strengthen your skills, and confidently prepare for internships and full-time opportunities.
    </p>
  </motion.div>

</div>

</section>
{/* Footer */}
<footer className="border-t border-slate-800 mt-10">

  <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center">

    <div>
      <h2 className="text-2xl font-bold text-blue-500">
        CareerForge AI
      </h2>

      <p className="text-gray-400 mt-2">
        Empowering students with AI-powered career guidance.
      </p>
    </div>

    <div className="flex gap-8 mt-6 md:mt-0 text-gray-400">

      <a href="#" className="hover:text-white transition">
        Features
      </a>

      <a href="#" className="hover:text-white transition">
        About
      </a>

      <a href="#" className="hover:text-white transition">
        Contact
      </a>

      <a href="#" className="hover:text-white transition">
        Privacy
      </a>

    </div>

  </div>

  <div className="border-t border-slate-800 py-6 text-center text-gray-500 text-sm">
    © {new Date().getFullYear()} CareerForge AI. All rights reserved.
  </div>

</footer>
    </main>
  );
}