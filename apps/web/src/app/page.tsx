// import { posts } from "@repo/db/data";
import { getActivePosts } from "@repo/db/posts";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  // const activePosts = posts.filter((post) => post.active);
  const activePosts = await getActivePosts();

  return (
    <AppLayout>
        <Main posts={activePosts} className={styles.main} page={page} /> {/*.*/}
    </AppLayout>
  );
}
