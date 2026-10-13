import {test, expect} from '@playwright/test';

test.use({viewport: {width: 320, height: 812}});

test('newsletter focus follows the pill and invalid emails show errors', async ({page}) => {
    await page.goto('/');
    const email = page.getByRole('textbox', {name: 'Email address'});
    await email.focus();
    await expect(email).toHaveCSS('outline-style', 'none');
    await expect(page.locator('.newsletter-field')).toHaveCSS('outline-style', 'solid');
    await expect(page.locator('.newsletter-field')).toHaveCSS('outline-offset', '-2px');
    for (const value of ['', 'not-an-email', 'lotte@', 'lotte@example']) {
        await email.fill(value);
        await page.getByRole('button', {name: 'Subscribe', exact: true}).click();
        await expect(email).toHaveAttribute('aria-invalid', 'true');
        await expect(page.locator('#newsletter-status')).toContainText('Enter a valid email address');
    }
    await email.fill('lotte@example.com');
    await page.getByRole('button', {name: 'Subscribe', exact: true}).click();
    await expect(email).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#newsletter-status')).toContainText('valid');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('favicon is served and workshop hover lifts the card four pixels', async ({page}) => {
    await page.goto('/');
    const iconPath = await page.locator('link[rel="icon"]').getAttribute('href');
    const icon = await page.request.get(iconPath);
    expect(icon.ok()).toBe(true);
    expect(icon.headers()['content-type']).toContain('image/png');
    const card = page.locator('.workshop-card').first();
    await card.hover();
    await expect(card).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -4)');
});
