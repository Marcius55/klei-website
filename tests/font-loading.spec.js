import {test, expect} from '@playwright/test';

test('critical fonts load locally without depending on Google Fonts', async ({page}) => {
    const externalFonts = [];
    page.on('request', request => {
        if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFonts.push(request.url());
    });
    await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(2);
    const fonts = await page.evaluate(() => ({
        display: document.fonts.check('600 28px Fraunces'),
        body: document.fonts.check('400 17px Inter'),
        loadedFamilies: [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family),
        fontUrls: performance.getEntriesByType('resource').filter(entry => entry.name.includes('.woff2')).map(entry => entry.name),
    }));
    expect(fonts.display).toBe(true);
    expect(fonts.body).toBe(true);
    expect(fonts.loadedFamilies).toContain('Fraunces');
    expect(fonts.loadedFamilies).toContain('Inter');
    expect(fonts.fontUrls).toHaveLength(2);
    expect(fonts.fontUrls.every(url => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
    expect(externalFonts).toEqual([]);
});
