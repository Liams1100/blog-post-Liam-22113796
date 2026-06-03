import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("DETAIL SCREEN", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Detail view",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      // DETAIL SCREEN > Detail page shows the same items as list item, but the short description is replaced by formatted long description

      const item = await page.getByTestId("blog-post-1");
      await expect(item).toBeVisible();

      await expect(item.getByText("Boost your conversion rate")).toBeVisible();
      await expect(
        item.getByText("Boost your conversion rate"),
      ).toHaveAttribute("href", "/post/boost-your-conversion-rate");

      await expect(item.getByText("Node")).toBeVisible();
      await expect(item.getByText("#Back-End")).toBeVisible();
      await expect(item.getByText("#Databases")).toBeVisible();
      await expect(item.getByText("18 Apr 2022")).toBeVisible();
      await expect(item.getByText("321 views")).toBeVisible();
      await expect(item.getByText("3 likes")).toBeVisible();

      // DETAIL SCREEN > Detail text is stored as Markdown, which needs to be converted to HTML
      await expect(
        await page.getByTestId("content-markdown").innerHTML(),
      ).toContain("<strong>sint voluptas</strong>");
    },
  );

  test(
    "Views increase on each view",
    {
      tag: "@a3",
    },
    async ({ page }) => {
      // BACKEND / CLIENT > Each visit of the page increases the post "views" count by one

      await page.goto("/post/boost-your-conversion-rate");
      await expect(page.getByText("321 views")).toBeVisible();
      await page.goto("/post/boost-your-conversion-rate");
      await expect(page.getByText("322 views")).toBeVisible();
    },
  );

  test(
    "Like posts",
    {
      tag: "@a3",
    },
    async ({ page }) => {
      // BACKEND / CLIENT > User can "like" the post on the detail screen, NOT on the list

      await page.goto("/post/boost-your-conversion-rate");
      await expect(page.getByText("3 likes")).toBeVisible();
      await page.getByTestId("like-button").click();
      await expect(page.getByText("4 likes")).toBeVisible();

      await page.goto("/post/boost-your-conversion-rate");
      await expect(page.getByText("4 likes")).toBeVisible();
      await page.getByTestId("like-button").click();
      await expect(page.getByText("3 likes")).toBeVisible();
    },
  );

  test(
    "Anonymous nested comments",
    {
      tag: "@a4",
    },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      const comments = page.getByTestId("comment-section");
      await expect(comments.getByText("No comments yet.")).toBeVisible();

      await comments.getByLabel("Name").fill("Taylor");
      await comments.getByLabel("Comment").fill("This article helped a lot.");
      await comments.getByRole("button", { name: "Post comment" }).click();

      await expect(comments.getByText("1 comment")).toBeVisible();
      await expect(comments.getByText("Taylor")).toBeVisible();
      await expect(
        comments.getByText("This article helped a lot."),
      ).toBeVisible();

      await comments.getByRole("button", { name: "Reply" }).click();
      await comments.getByLabel("Name").last().fill("Anonymous Reader");
      await comments.getByLabel("Comment").last().fill("Same here.");
      await comments.getByRole("button", { name: "Post reply" }).click();

      await expect(comments.getByText("2 comments")).toBeVisible();
      await expect(comments.getByText("Anonymous Reader")).toBeVisible();
      await expect(comments.getByText("Same here.")).toBeVisible();
    },
  );
});
