import {test, expect} from '@playwright/test';

test('Analytics stays removed even for previously consenting visitors', async ({page, context, baseURL}) => {
    const trackingRequests = [];
    page.on('request', request => {
        if (/googletagmanager|google-analytics/.test(request.url())) trackingRequests.push(request.url());
    });
    await page.route(/https:\/\/[^/]*(?:googletagmanager|google-analytics)\.com\//, route => route.abort());
    await page.addInitScript(() => localStorage.setItem('klei-analytics-consent', JSON.stringify({version: 1, choice: 'granted', expires: Date.now() + 86400000})));
    await context.addCookies([
        {name: '_ga', value: 'old-cookie', url: baseURL},
        {name: '_ga_N83662NFNF', value: 'old-cookie', url: baseURL},
        {name: 'unrelated-preference', value: 'keep', url: baseURL},
    ]);
    await page.goto('/');
    await expect(page.locator('.cookie-banner')).toHaveCount(0);
    await expect(page.getByRole('button', {name: 'Cookie settings', exact: true})).toHaveCount(0);
    expect(await page.evaluate(() => ({gtag: typeof window.gtag, choice: localStorage.getItem('klei-analytics-consent')}))).toEqual({gtag: 'undefined', choice: null});
    const cookies = await context.cookies();
    expect(cookies.filter(cookie => cookie.name.startsWith('_ga'))).toEqual([]);
    expect(cookies.some(cookie => cookie.name === 'unrelated-preference')).toBe(true);
    const privacyButton = page.getByRole('button', {name: 'Privacy', exact: true});
    await privacyButton.click();
    await expect(page.getByRole('dialog')).toContainText('Google Analytics has been removed');
    await page.getByRole('dialog').press('Escape');
    await expect(privacyButton).toBeFocused();
    await page.reload();
    expect(trackingRequests).toEqual([]);
});
