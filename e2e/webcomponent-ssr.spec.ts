import { test, expect } from '@playwright/test';

test.describe('Webcomponent SSR', () => {
  test('renders SSR content with Declarative Shadow DOM', async ({ page }) => {
    const response = await page.goto('http://localhost:3001');
    expect(response?.status()).toBe(200);

    const html = await response!.text();

    // SSR: HTML should contain pre-rendered content before client hydration
    expect(html).toContain('feedlog-badge');
    expect(html).toContain('feedlog-button');
    expect(html).toContain('feedlog-card');
    expect(html).toContain('SSR Badge');
    expect(html).toContain('SSR Button');
    expect(html).toContain('SSR Card');

    // Declarative Shadow DOM or shadowroot
    expect(html).toMatch(/shadowroot|shadow-root|template/);
  });

  test('components are visible and interactive after load', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Badge should be visible
    const badge = page.locator('feedlog-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('SSR Badge');

    // Button should be visible
    const button = page.locator('feedlog-button');
    await expect(button).toBeVisible();
    await expect(button).toContainText('SSR Button');

    // Card should be visible
    const card = page.locator('feedlog-card');
    await expect(card).toBeVisible();
  });
});
