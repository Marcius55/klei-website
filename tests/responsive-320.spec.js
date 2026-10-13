import {test, expect} from '@playwright/test';

test.use({viewport: {width: 320, height: 812}});

test('320px page and mobile menu fit the viewport', async ({page}) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const checkOverflow = async () => {
        const layout = await page.evaluate(() => ({
            viewport: window.innerWidth,
            width: document.documentElement.scrollWidth,
            overflowing: [...document.querySelectorAll('main *, footer *')]
                .filter(element => element.getBoundingClientRect().right > window.innerWidth)
                .map(element => element.className || element.tagName),
        }));
        expect(layout.width, JSON.stringify(layout)).toBeLessThanOrEqual(layout.viewport);
    };
    await checkOverflow();
    await page.screenshot({path: 'screenshots/mobile-320.png', fullPage: true});
    await page.getByRole('button', {name: 'Open navigation', exact: true}).click();
    await checkOverflow();
    await page.getByRole('button', {name: 'Close navigation', exact: true}).last().press('Escape');
    await expect(page.getByRole('button', {name: 'Open navigation', exact: true})).toBeFocused();
});
