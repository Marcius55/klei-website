# Klei — Ceramics studio in Mechelen

Live website: [https://klei-website.vercel.app/](https://klei-website.vercel.app/)

A responsive landing page for Klei, built with Vite, vanilla HTML, CSS and JavaScript. The design uses Fraunces and Inter, with shared design tokens in `src/styles/tokens.css`.

## Analytics choice: GA4 vs Plausible

GA4 is free to use, lets me create customised reports, and connects easily with Google Ads and BigQuery.
Its dashboard seems hard to learn, and detailed event data in a standard GA4 property can be retained for up to 14 months, so longer-term analysis requires exporting the data.
Plausible offers simpler, lightweight, cookie-free analytics that does not itself need an analytics-cookie banner, but its hosted service has a monthly fee.

Sources: [Google Analytics data retention](https://support.google.com/analytics/answer/7667196), [Plausible's cookie-free analytics](https://plausible.io/cookieless-web-analytics), and [Plausible subscription plans](https://plausible.io/docs/subscription-plans).

I chose GA4 for this project. It is loaded only after the visitor accepts analytics through the cookie banner; rejecting analytics keeps the Google script from loading, and the visitor can change their choice using Cookie settings in the footer.

## Three things AI got wrong and how I fixed them

1. **Icon sizes:** The AI kept making the icons too big or too small. I fixed this by pasting in an identical icon from the internet as a reference.
2. **Card borders and divider lines:** When the page had two cards, the AI kept getting the border colour and divider lines wrong, even after I explained them. I opened DevTools, copied the exact hex codes and class names, and used those in my instructions.
3. **Logo size:** The AI made the logo too small, then too big. I fixed this by telling the AI to use the logo in the navbar as the reference.

## Run locally

```bash
npm install
npx playwright install chromium
npm run dev
```

## Build and tests

```bash
npm run build
npm test
```

## Checklist and evidence

See [CHECKLIST.md](CHECKLIST.md) for the assignment checklist and the supplied Lighthouse screenshots. Evidence images are stored in `docs/evidence/` so they are visible in this repository on GitHub.
