import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001/pagination';

test.describe('Pagination - Load More mode', () => {
  test('renders Load More button and issues', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#load-more-widget');
    await expect(widget).toBeVisible();

    await expect(widget).toContainText('Load More Test');
    await expect(widget).toContainText('Load More Issues');
  });

  test('shows skeleton cards while loading more', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#load-more-widget');
    await expect(widget).toBeVisible();

    // Click Load More
    const loadMoreBtn = widget.locator('text=Load More Issues');
    await loadMoreBtn.click();

    // Skeletons should appear (the server script uses a 1.5s delay)
    const skeletons = widget.locator('.skeleton-card');
    await expect(skeletons.first()).toBeVisible({ timeout: 2000 });

    // Wait for skeletons to be replaced with real issues
    await expect(skeletons.first()).not.toBeVisible({ timeout: 5000 });

    // Should now have 6 issues (3 original + 3 loaded)
    await expect(widget).toContainText('Issue 4');
  });

  test('hides Load More button after all issues loaded', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#load-more-widget');

    // Load more twice (3 pages total, then hasMore=false)
    for (let i = 0; i < 2; i++) {
      const loadMoreBtn = widget.locator('text=Load More Issues');
      await loadMoreBtn.click();
      // Wait for loading to finish
      await expect(widget.locator('.skeleton-card').first()).not.toBeVisible({ timeout: 5000 });
    }

    // Button should be gone
    await expect(widget.locator('text=Load More Issues')).not.toBeVisible();
  });

  test('skeleton cards persist during slow network', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#load-more-widget');
    await expect(widget).toBeVisible();

    const loadMoreBtn = widget.locator('text=Load More Issues');
    await loadMoreBtn.click();

    // Verify skeletons are visible after 500ms (well within the 1.5s mock delay)
    await page.waitForTimeout(500);
    const skeletons = widget.locator('.skeleton-card');
    await expect(skeletons.first()).toBeVisible();

    // After 1s, still loading
    await page.waitForTimeout(500);
    await expect(skeletons.first()).toBeVisible();
  });
});

test.describe('Pagination - Prev/Next mode', () => {
  test('renders Prev and Next buttons', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#prev-next-widget');
    await expect(widget).toBeVisible();

    const prevBtn = widget.locator('button[aria-label="Previous page"]');
    const nextBtn = widget.locator('button[aria-label="Next page"]');

    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
  });

  test('Prev is disabled on first page', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#prev-next-widget');
    const prevBtn = widget.locator('button[aria-label="Previous page"]');

    await expect(prevBtn).toBeDisabled();
  });

  test('navigating Next changes displayed issues', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#prev-next-widget');
    await expect(widget).toContainText('Issue 1');

    const nextBtn = widget.locator('button[aria-label="Next page"]');
    await nextBtn.click();

    await expect(widget).toContainText('Issue 4');
    await expect(widget).not.toContainText('Issue 1');
  });

  test('navigating Prev returns to previous page', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#prev-next-widget');
    const nextBtn = widget.locator('button[aria-label="Next page"]');
    const prevBtn = widget.locator('button[aria-label="Previous page"]');

    // Go to page 2
    await nextBtn.click();
    await expect(widget).toContainText('Issue 4');

    // Go back to page 1
    await prevBtn.click();
    await expect(widget).toContainText('Issue 1');
    await expect(prevBtn).toBeDisabled();
  });

  test('Next is disabled on last page', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#prev-next-widget');
    const nextBtn = widget.locator('button[aria-label="Next page"]');

    // Navigate to last page (page 3)
    await nextBtn.click();
    await nextBtn.click();

    await expect(nextBtn).toBeDisabled();
    await expect(widget).toContainText('Issue 7');
  });

  test('does not render numbered page buttons', async ({ page }) => {
    await page.goto(BASE_URL);

    const widget = page.locator('#prev-next-widget');
    const paginationBtns = widget.locator('.pagination button');

    // Only 2 buttons: Prev and Next
    await expect(paginationBtns).toHaveCount(2);
  });
});
