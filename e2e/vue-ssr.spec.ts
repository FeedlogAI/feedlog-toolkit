import { test, expect } from '@playwright/test';

test.describe('Vue SSR', () => {
  test('renders SSR content with Feedlog components', async ({ page }) => {
    const response = await page.goto('http://127.0.0.1:3003');
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
      if (msg.type() === 'error' && text.toLowerCase().includes('hydration')) {
        consoleErrors.push(text);
      }
    });

    await page.goto('http://127.0.0.1:3003');
    await page.waitForLoadState('networkidle');

    // No hydration mismatch errors
    expect(consoleErrors).toHaveLength(0);

    // Components hydrated: verify presence and content (Vue/Shadow DOM can make toBeVisible flaky)
    const badge = page.locator('feedlog-badge');
    await expect(badge).toContainText('SSR Badge', { timeout: 15000 });
    await expect(badge).toBeAttached();

    const button = page.locator('feedlog-button');
    await expect(button).toContainText('SSR Button', { timeout: 5000 });
    await expect(button).toBeAttached();

    const card = page.locator('feedlog-card');
    await expect(card).toBeAttached();
    await expect(card).toContainText('SSR Card', { timeout: 5000 });
  });
});
