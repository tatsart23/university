const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("blog app", () => {
  let randomUsername;
  let randomPassword = "password123";
  let randomPostname;

  beforeEach(async ({ page, request }) => {
    randomUsername = `testuser_${Date.now()}`;
    randomPostname = `testpost_${Date.now()}`;

    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Test User",
        username: randomUsername,
        password: randomPassword,
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // Testaa, että kirjautumislomake näkyy
    await expect(page.locator("h2")).toHaveText("Login");
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText("login");
  });

  test("User can log in", async ({ page }) => {
    await page.fill('input[name="username"]', randomUsername);
    await page.fill('input[name="password"]', randomPassword);
    await page.click('button[type="submit"]');

    await expect(page.locator("h2")).toHaveText("Blogs");
  });

  test("login fails with wrong information", async ({ page }) => {
    // Testaa, että kirjautuminen epäonnistuu väärillä tiedoilla
    await page.fill('input[name="username"]', randomUsername);
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator(".error")).toHaveText("wrong username/password");
  });

  test("User can upload a blog", async ({ page }) => {
    await page.fill('input[name="username"]', randomUsername);
    await page.fill('input[name="password"]', randomPassword);
    await page.click('button[type="submit"]');

    await page.click('button:has-text("Create New Blog")');
    await page.fill('input[name="title"]', randomPostname);
    await page.fill('input[name="author"]', "Test author");
    await page.fill('input[name="url"]', "http://testurl.com");
    await page.click('button:has-text("Create")');

    const notification = page.locator(".notification.success");
    await expect(notification).toBeVisible();

    await expect(notification).toHaveText("Blog created successfully");
  });

  test("User can like a blog", async ({ page }) => {
    await page.fill('input[name="username"]', randomUsername);
    await page.fill('input[name="password"]', randomPassword);
    await page.click('button[type="submit"]');

    await page.click('button:has-text("View")');
    await page.click('button:has-text("Like")');
  });

  test("User can delete a blog he created", async ({ page }) => {
    await page.fill('input[name="username"]', randomUsername);
    await page.fill('input[name="password"]', randomPassword);
    await page.click('button[type="submit"]');

    await page.click('button:has-text("Create New Blog")');
    await page.fill('input[name="title"]', "my own blog to delete");
    await page.fill('input[name="author"]', "Test author");
    await page.fill('input[name="url"]', "http://testurl.com");
    await page.click('button:has-text("Create")');

    await expect(page.locator("text=my own blog to delete")).toBeVisible();

    const viewButton = page
      .locator("text=my own blog to delete")
      .locator('button:has-text("View")');
    await viewButton.click();

    const deleteButton = page.locator('button:has-text("Delete")');
    await expect(deleteButton).toBeVisible();

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await deleteButton.click();
  });
});
