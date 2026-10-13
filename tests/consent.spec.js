import {test, expect} from '@playwright/test';

const id = 'G-N83662NFNF';
const key = 'klei-analytics-consent';

test.beforeEach(async ({page}) => {
    // Never send test visits to the real GA4 property.
    await page.route('https://www.googletagmanager.com/**', route => route.fulfill({contentType: 'application/javascript', body: ''}));
    await page.route(/https:\/\/[^/]*google-analytics\.com\//, route => route.abort());
});

test('first visit and remembered rejection never load Google Analytics', async ({page}) => {
    const requests = [];
    page.on('request', request => {
        if (/googletagmanager|google-analytics/.test(request.url())) requests.push(request.url());
    });
    await page.goto('/');
    await expect(page.locator('.cookie-banner')).toBeVisible();
    await expect(page.locator('#klei-google-analytics')).toHaveCount(0);
    expect(requests).toEqual([]);
    await page.getByRole('button', {name: 'Reject analytics', exact: true}).click();
    await page.reload();
    await expect(page.locator('.cookie-banner')).toBeHidden();
    await expect(page.locator('#klei-google-analytics')).toHaveCount(0);
    expect(requests).toEqual([]);
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).choice, key)).toBe('denied');
});

test('acceptance loads once, keeps ads denied, and withdrawal clears GA cookies', async ({page, context}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Accept analytics', exact: true}).click();
    await expect(page.locator('#klei-google-analytics')).toHaveCount(1);
    expect(await page.evaluate(id => window[`ga-disable-${id}`], id)).toBe(false);
    const consent = await page.evaluate(() => [...window.dataLayer].map(command => Array.from(command)).filter(command => command[0] === 'consent').at(-1)[2]);
    expect(consent).toEqual({analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    await page.getByRole('button', {name: 'Cookie settings', exact: true}).click();
    await page.getByRole('button', {name: 'Accept analytics', exact: true}).click();
    expect(await page.evaluate(() => [...window.dataLayer].filter(command => command[0] === 'config').length)).toBe(1);
    const cookieUrl = new URL(page.url()).origin;
    await context.addCookies([{name: '_ga', value: 'test', url: cookieUrl}, {name: '_ga_N83662NFNF', value: 'test', url: cookieUrl}]);
    await page.getByRole('button', {name: 'Cookie settings', exact: true}).click();
    await page.getByRole('button', {name: 'Reject analytics', exact: true}).click();
    expect(await page.evaluate(id => window[`ga-disable-${id}`], id)).toBe(true);
    expect((await context.cookies()).filter(cookie => cookie.name.startsWith('_ga'))).toEqual([]);
    await page.reload();
    await expect(page.locator('#klei-google-analytics')).toHaveCount(0);
});

test('remembered acceptance loads Analytics on a later visit', async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Accept analytics', exact: true}).click();
    await page.reload();
    await expect(page.locator('.cookie-banner')).toBeHidden();
    await expect(page.locator('#klei-google-analytics')).toHaveCount(1);
});

test('expired acceptance asks again and privacy dialog supports Escape', async ({page}) => {
    await page.addInitScript(key => localStorage.setItem(key, JSON.stringify({version: 1, choice: 'granted', expires: Date.now() - 1})), key);
    await page.goto('/');
    await expect(page.locator('.cookie-banner')).toBeVisible();
    await expect(page.locator('#klei-google-analytics')).toHaveCount(0);
    const privacy = page.getByRole('button', {name: 'Read privacy details', exact: true});
    await privacy.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('dialog').press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(privacy).toBeFocused();
});

test('banner fits at 320px and cannot silently remember consent when storage fails', async ({page}) => {
    await page.setViewportSize({width: 320, height: 812});
    await page.addInitScript(() => {Storage.prototype.setItem = () => {throw new Error('Storage unavailable');};});
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    await page.getByRole('button', {name: 'Reject analytics', exact: true}).click();
    await expect(page.locator('#cookie-status')).toContainText('could not remember');
    await page.reload();
    await expect(page.locator('.cookie-banner')).toBeVisible();
    await expect(page.locator('#klei-google-analytics')).toHaveCount(0);
});
