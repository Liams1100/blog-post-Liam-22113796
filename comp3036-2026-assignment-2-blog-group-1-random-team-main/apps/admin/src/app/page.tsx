// import { posts } from "@repo/db/data";
import { getPosts } from "@repo/db/posts";
import { isLoggedIn } from "../utils/auth";
import styles from "./page.module.css";
import { AdminPostList } from "../components/AdminPostList";
import LoginPage from "./login/page";
import Script from "next/script";

// Previous server-action logout was replaced so logout uses DELETE /api/auth as
// required by the assignment.
//
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
//
// async function logout() {
//   "use server";
//
//   const cookieStore = await cookies();
//   cookieStore.delete("auth_token");
//   redirect("/login");
// }

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    // Previously this redirected to /login. The admin home page now displays
    // the login control directly when the JWT token is missing or invalid.
    // redirect("/login");
    return <LoginPage />;
  } else {
    // const adminPosts = posts;
    const adminPosts = await getPosts();

    return (
      <main className={`${styles.main} min-h-screen bg-slate-50 p-6`}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-blue-700">Admin of Full Stack Blog</h1>
            {/* Previous logout UI used a server action:
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </form>
            */}
            
            <button
              id="logout-button"
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
            <Script id="logout-handler" strategy="afterInteractive">
              {`
                document.addEventListener("click", async (event) => {
                  if (event.target.closest("#logout-button")) {
                    await fetch("/api/auth", { method: "DELETE" });
                    window.location.href = "/";
                  }
                });
              `}
            </Script>
          </div>
          <AdminPostList posts={adminPosts} />
        </div>
      </main>
    );
  }
}
