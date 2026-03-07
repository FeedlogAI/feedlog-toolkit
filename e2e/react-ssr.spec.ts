import { test, expect } from '@playwright/test';

test.describe('React SSR', () => {
  test('renders SSR content with Feedlog components', async ({ page }) => {
    const response = await page.goto('http://127.0.0.1:3002');
    expect(response?.status()).toBe(200);

    const html = await response!.text();

    // SSR: HTML should contain pre-rendered Feedlog components
    expect(html).toContain('feedlog-badge');
    expect(html).toContain('feedlog-button');
    expect(html).toContain('feedlog-card');
    expect(html).toContain('SSR Badge');
    expect(html).toContain('SSR Button');
    expect(html).toContain('SSR Card');
  });

  test('components are visible and interactive after hydration', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error' && text.includes('hydration')) {
        consoleErrors.push(text);
      }
    });

    await page.goto('http://127.0.0.1:3002');

    // No hydration mismatch errors
    expect(consoleErrors).toHaveLength(0);

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
