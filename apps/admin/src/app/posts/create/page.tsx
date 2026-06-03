import { redirect } from "next/navigation";
import { AdminPostModifyForm } from "../../../components/AdminPostModifyForm";
import { isLoggedIn } from "../../../utils/auth";

export default async function CreatePostPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/login");
  }

  return <AdminPostModifyForm />;
}
