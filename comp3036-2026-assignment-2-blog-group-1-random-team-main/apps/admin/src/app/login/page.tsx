"use client";

import { FormEvent, useState } from "react";

// Previous server-action login was replaced so login uses POST /api/auth as
// required by the assignment.
//
// import { env } from "@repo/env/admin";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
//
// async function login(formData: FormData) {
//   "use server";
//
//   const email = formData.get("email");
//   const password = formData.get("password");
//
//   if (password !== env.PASSWORD) {
//     return;
//   }
//
//   const cookieStore = await cookies();
//   const token = jwt.sign({ email }, env.JWT_SECRET, { expiresIn: "1d" });
//
//   cookieStore.set("auth_token", token, {
//     httpOnly: true,
//     path: "/",
//     maxAge: 60 * 60 * 24,
//   });
//
//   redirect("/");
// }

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      setError("Invalid password");
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-slate-900">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in to your account</h1>

        {/* Previous form used action={login}*/}
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 py-2.5 font-medium text-white transition-colors hover:bg-slate-700"
          >
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}
