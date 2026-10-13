# CHECKLIST.md — the last 30%

AI builds the first 70%. This list is the rest. Tick an item only when you checked it yourself, on a real device where it says so.

Under every category: a prompt to let Codex audit it first. It reports, you decide what gets fixed.

## 1. Detail

- [ ] Spacing, alignment and font sizes match the frames in `design/frames/`
- [ ] Fraunces and Inter, in the right weights — no fallback font anywhere
- [ ] Only colours from `tokens.css` (search your CSS for `#`)
- [ ] Every state from `components.png`: hover, focus, current page, error
- [ ] The real copy from the design, no lorem ipsum

> *Ask Codex:* Compare the page at 375px and 1440px with design/frames/. List every difference in spacing, alignment, type and colour per section. Do not fix anything yet.

## 2. Responsive

- [ ] Drag the window from 320 to 1920: nothing breaks, overlaps or jumps
- [ ] No horizontal scroll at any width
- [ ] Tablet (768) follows your decision in `AGENTS.md`
- [ ] Tested on your own phone, portrait and landscape

> *Ask Codex:* Check the page at 320, 375, 768, 1024, 1440 and 1920px. Report every overflow, overlap or awkward wrap, with the width where it happens.

## 3. Sizing

- [ ] Touch targets at least 44 × 44px on mobile (buttons, links, burger, FAQ)
- [ ] Line length of body text at most ±70 characters
- [ ] Headings scale fluidly (`clamp()`), no sudden jumps between breakpoints
- [ ] Images keep their aspect ratio, nothing is stretched

> *Ask Codex:* List every interactive element smaller than 44×44px on mobile, and every text block wider than 70 characters per line.

## 4. Animation

- [ ] Hover and focus transitions on buttons, links and cards
- [ ] The mobile menu opens and closes with an animation
- [ ] The FAQ accordion opens smoothly
- [ ] At least one subtle reveal on scroll
- [ ] Everything calm with `prefers-reduced-motion: reduce`

> *Ask Codex:* Propose micro-interactions for this page: what, which property, duration and easing. Only `transform` and `opacity`. Respect prefers-reduced-motion. Do not implement yet.

## 5. Loading

- [ ] Lighthouse Performance ≥ 90 (on the live URL, mobile)
- [ ] No layout shift while loading: images and fonts have reserved space
- [ ] Fonts: `preconnect` + `display=swap`
- [ ] Below-the-fold images: `loading="lazy"`
- [ ] Nothing loaded that is not used

> *Ask Codex:* Run a performance audit: what blocks rendering, what shifts the layout, what is loaded but not used? Report first.

## 6. Meta & sharing

- [ ] `<title>` and `<meta name="description">` written by you, not generic
- [ ] Open Graph: `og:title`, `og:description`, `og:image` (1200 × 630, absolute URL)
- [ ] Favicon (SVG) and `theme-color`
- [ ] `<html lang="en">`
- [ ] Share preview tested: paste the live URL in WhatsApp, Slack or [opengraph.xyz](https://www.opengraph.xyz/)

> *Ask Codex:* Audit the head of index.html for SEO and social sharing. What is missing or generic?

## 7. Analytics

- [ ] Google Analytics 4 installed, with your own Measurement ID
- [ ] A cookie banner: **nothing** is tracked before the visitor accepts
- [ ] Refusing works, and the choice is remembered
- [ ] You see your own visit in GA4 → Realtime
- [ ] In `README.md`: GA4 vs one alternative, pros and cons, 3 sentences

> *Ask Codex:* Add Google Analytics 4 behind a cookie consent banner, with Consent Mode v2: denied by default, granted only after accepting. Explain every line you add.

## 8. Usability

- [ ] Keyboard only: menu, FAQ and the email field all work, and you always see where you are
- [ ] The email field: a label, a clear error message, a clear success state
- [ ] Every link goes somewhere (or is clearly not a link)
- [ ] Lighthouse Accessibility, Best Practices and SEO ≥ 95
- [ ] Someone else tested it on their phone, and you fixed what they found

> *Ask Codex:* Walk through the page with the keyboard only, using the Playwright MCP. Report every place where focus is invisible, trapped or lost.
