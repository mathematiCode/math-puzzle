import { test, expect } from '@playwright/test';

// This test checks that all the links in the nav bar work correctly

test.describe('NavBar links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('About The Game link navigates correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'About The Game' }).click();
    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator('h1, h2')).toContainText([/What Math/i]);
  });

  test('About The Creator link navigates correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'About The Creator' }).click();
    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator('h1, h2')).toContainText([/creator|about/i]);
  });

  test('Play The Game link navigates correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Play The Game' }).click();
    await expect(page).toHaveURL(/.*game/);
    await expect(page.locator('button')).toContainText([/Next Level/i]);
  });
});
