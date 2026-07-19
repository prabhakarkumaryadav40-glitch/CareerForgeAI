"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (isSignup) {
        const { error } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (error) throw error;

        alert(
          "Account created successfully. Please login."
        );

        setIsSignup(false);
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;

        router.push("/dashboard");
      }
    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          {isSignup ? "Create Account" : "Login"}
        </h1>

        <form
          onSubmit={handleAuth}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 p-3 rounded-lg font-semibold"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <button
          onClick={() =>
            setIsSignup(!isSignup)
          }
          className="mt-4 text-blue-400 w-full"
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>

      </div>
    </main>
  );
}
