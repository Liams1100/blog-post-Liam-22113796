import { seed } from "@repo/db/seed";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

async function login(page: Page) {
  await page.goto("/");

  await page.getByLabel("Password", { exact: true }).fill("123");
  await page.getByText("Sign In", { exact: true }).click();

  await expect(page.getByText("Admin of Full Stack Blog")).toBeVisible();
}

test.beforeEach(async () => {
  await seed();
});

test.describe("ADMIN RICH TEXT EDITOR", () => {
  test(
    "Keeps the content textarea fillable while Quill is mounted",
    {
      tag: "@a4",
    },
    async ({ page }) => {
      await login(page);
      await page.goto("/post/no-front-end-framework-is-the-best");

      const textarea = page.getByLabel("Content", { exact: true });
      const quillEditor = page.locator(
        '[aria-label="Rich text editor"] .ql-editor',
      );

      await expect(textarea).toBeVisible();
      await expect(quillEditor).toBeVisible();

      await textarea.fill("**Library sync test**");

      await expect(quillEditor).toContainText("Library sync test");

      await page.getByText("Preview").click();
      await expect(page.getByTestId("content-preview")).toBeVisible();
      await expect(
        await page.getByTestId("content-preview").innerHTML(),
      ).toContain("<strong>Library sync test</strong>");
    },
  );

  test(
    "Syncs Quill edits back to the content textarea",
    {
      tag: "@a4",
    },
    async ({ page }) => {
      await login(page);
      await page.goto("/post/no-front-end-framework-is-the-best");

      const textarea = page.getByLabel("Content", { exact: true });
      const quillEditor = page.locator(
        '[aria-label="Rich text editor"] .ql-editor',
      );

      await expect(quillEditor).toBeVisible();

      await quillEditor.fill("Quill typed content");

      await expect(textarea).toHaveValue(
        /Quill(?:&nbsp;|\s)typed(?:&nbsp;|\s)content/, //&nbsp; is spaces used by quill
      );
    },
  );
});
