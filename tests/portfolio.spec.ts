import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('light responsive layouts, images, and contact links', async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [1440, 1280, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hi, I’m Sai.');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(251, 253, 255)');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await expect(page.getByRole('link', { name: 'Email Me', exact: true })).toHaveAttribute('href', 'mailto:saitharunreddy@writecode.in');
    await page.screenshot({ path: `test-results/hero-${width}.png`, animations: 'disabled' });
    // Reach every project through its real document position and check loaded images.
    await page.locator('#contact').scrollIntoViewIfNeeded();
    expect(await page.locator('img').evaluateAll((images) => images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBeTruthy();
  }
  expect(errors).toEqual([]);
  await expect(page.locator('main')).not.toContainText('AI/ML');
  await expect(page.locator('main')).not.toContainText('Built with intent');
});

test('cards pin, recede, and overlap while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.project-stack')).toHaveAttribute('data-stacking', 'true');
  const secondTop = await page.locator('.stack-panel').nth(1).evaluate((panel) => panel.getBoundingClientRect().top + scrollY);
  await page.evaluate((top) => window.scrollTo({ top: top - 350, behavior: 'instant' }), secondTop);
  await expect(page.locator('.stack-panel').first()).toHaveCSS('position', 'fixed');
  const transform = await page.locator('.project-card').first().evaluate((card) => {
    const matrix = new DOMMatrix(getComputedStyle(card).transform);
    return Math.hypot(matrix.a, matrix.b);
  });
  expect(transform).toBeLessThan(.99);
  expect(transform).toBeGreaterThan(.93);
  const cards = await page.locator('.project-card').evaluateAll((elements) => elements.slice(0, 2).map((element) => element.getBoundingClientRect().toJSON()));
  expect(cards[1].top).toBeLessThan(cards[0].bottom);
  await page.screenshot({ path: 'test-results/stack-overlap.png' });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  await expect(page.locator('.project-stack')).toHaveAttribute('data-mobile-stacking', 'true');
  await expect(page.locator('.stack-panel').first()).toHaveCSS('position', 'sticky');
});

test('project dialogs, mobile menu, clipboard, and real resume download', async ({ page, request, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Explore project' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Visit website' })).toHaveAttribute('href', 'https://writecode.in');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('saitharunreddy@writecode.in');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download Resume', exact: true }).last().click();
  expect((await downloadPromise).suggestedFilename()).toBe('Sai-Tharun-Reddy-Resume.pdf');
  const resume = await request.get('/resume');
  expect(resume.status()).toBe(200);
  expect((await resume.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test('reduced motion, metadata, and accessibility', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page).toHaveTitle(/Koppula Sai Tharun Reddy/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /opengraph-image/);
  await expect(page.locator('.project-stack')).not.toHaveAttribute('data-stacking', 'true');
  await expect(page.locator('.stack-panel').first()).toHaveCSS('position', 'relative');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('deployed metadata, sharing image, and download headers', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://saitharunreddy.me');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('https://saitharunreddy.me');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('https://saitharunreddy.me/sitemap.xml');
  const image = await request.get('/opengraph-image');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/png');
  const resume = await request.get('/resume');
  expect(resume.headers()['content-disposition']).toContain('attachment');
  expect(resume.headers()['content-type']).toBe('application/pdf');
  expect((await request.get('/does-not-exist')).status()).toBe(404);
});
