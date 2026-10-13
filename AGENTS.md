# AGENTS.md

## Project

The landing page of Klei, a ceramics studio in Mechelen, for people who want to book a pottery workshop.
The design is in `design/frames/`, the illustrations in `design/assets/`. Look at both before every task.

## Stack

- Vite + vanilla HTML, CSS and JavaScript
- Fonts: Fraunces (400, 600) and Inter (400, 500, 600) from Google Fonts
- No new dependencies without asking first

## Commands

- `npm run dev` — dev server on http://localhost:5173
- `npm run build` — production build
- `npm test` — Playwright: screenshots, horizontal scroll, accessibility, meta tags

## Rules

- Colours, font sizes, spacing and radii come **only** from `src/styles/tokens.css`. A value is missing? Ask, do not invent one.
- Semantic HTML: `header`, `nav`, `main`, `section`, `footer`. One `h1`, headings in order.
- Mobile first. Flexbox and grid. Never absolute positioning to imitate the design.
- Every interactive element is a real `button` or `a`, with a visible `:focus-visible` state.
- Images are the SVGs from `design/assets/`, with `width`, `height` and a meaningful `alt`.
- Work in small slices: one section per task. Show a plan before you change more than three files.
- Never change a test to make it pass.

## Decisions

What the design does not show. Fill this in yourself — "to be decided" is not a decision.

- Tablet (768px): switch to the desktop navigation; use a two-column hero and two-column workshop grid, with the final workshop card spanning the available row.
- Between 375 and 1440: keep content fluid inside `--container` with `--gutter`; stack layouts until their content fits without overflow, then progressively introduce grid columns.
- Mobile menu: the menu button opens a modal navigation panel, updates `aria-expanded`, moves focus to the close button and traps Tab inside the panel. The close button, Escape and selecting a navigation link close it and return focus to the menu button.
- FAQ: allow one item open at a time. Each question is a real button with `aria-expanded` and `aria-controls`, so Enter and Space work without custom keyboard handlers.
- Motion: buttons and cards transition transform and opacity for `--motion-fast`; the mobile menu and FAQ content reveal use transform and opacity for `--motion-medium`; all use `--ease-standard`. Under `prefers-reduced-motion: reduce`, transitions and reveal transforms are removed.
- Email signup: prevent navigation, validate the address in the browser, show an inline error linked with `aria-describedby` when invalid, and replace the form status with a polite success message after a valid submit. No address is sent or stored until a real newsletter service is connected.

## Definition of done

A task is done when:

1. `npm run build` passes
2. `npm test` is green
3. You list what you did **not** check, and which items of `CHECKLIST.md` are still open
