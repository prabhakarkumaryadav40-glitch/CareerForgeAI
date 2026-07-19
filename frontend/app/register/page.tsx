"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    alert("BUTTON CLICKED");
    console.log("BUTTON CLICKED");

    console.log("FULL NAME:", fullName);
    console.log("EMAIL:", email);
    console.log(
      "PASSWORD LENGTH:",
      password.length
    );

    setLoading(true);

    try {
      console.log("STARTING SIGNUP...");

      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

      console.log("SIGNUP DATA:", data);
      console.log("SIGNUP ERROR:", error);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Signup successful!");

      router.push("/login");
    } catch (error) {
      console.error(
        "REGISTRATION FAILED:",
        error
      );

      alert(
        "Registration failed. Check console."
      );
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800"
            required
          />

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
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold disabled:bg-gray-600"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

        </form>

      </div>
    </main>
  );
}