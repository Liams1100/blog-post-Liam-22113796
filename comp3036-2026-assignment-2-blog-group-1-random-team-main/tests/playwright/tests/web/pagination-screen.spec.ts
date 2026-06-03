import { seed } from "@repo/db/seed";
import { createPost } from "@repo/db/posts";
import { expect, test } from "./fixtures";

const testPost = {
  category: "React",
  content: "Pagination test content",
  description: "Pagination test description",
  imageUrl: "https://example.com/image.jpg",
  tags: "Pagination,Test",
};

async function createPaginationPosts(count: number) {
  for (let index = 1; index <= count; index += 1) {
    await createPost({
      ...testPost,
      title: `Pagination Test Post ${index}`,
    });
  }
}

test.beforeEach(async () => {
  await seed();
});

test.afterEach(async () => {
  await seed();
});

test.describe("PAGINATION", () => {
  test(
    "Shows four posts per page and navigates between pages",
    {
      tag: "@a4",
    },
    async ({ page }) => {
      await createPaginationPosts(3);

      await page.goto("/");

      await expect(page.locator("article")).toHaveCount(4);
      await expect(page.getByText("Page 1 of 2")).toBeVisible();
      await expect(page.getByRole("link", { name: "Next" })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Previous" }),
      ).not.toBeVisible();

      await page.getByRole("link", { name: "Next" }).click();

      await expect(page).toHaveURL("/?page=2");
      await expect(page.locator("article")).toHaveCount(2);
      await expect(page.getByText("Page 2 of 2")).toBeVisible();
      await expect(page.getByRole("link", { name: "Previous" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Next" })).not.toBeVisible();
    },
  );

  test(
    "Keeps search filters when moving to the next page",
    {
      tag: "@a4",
    },
    async ({ page }) => {
      await createPaginationPosts(5);

      await page.goto("/search?q=Pagination");

      await expect(page.locator("article")).toHaveCount(4);
      await expect(page.getByText("Page 1 of 2")).toBeVisible();

      await page.getByRole("link", { name: "Next" }).click();

      await expect(page).toHaveURL("/search?q=Pagination&page=2");
      await expect(page.locator("article")).toHaveCount(1);
      await expect(page.getByText("Page 2 of 2")).toBeVisible();
    },
  );
});
