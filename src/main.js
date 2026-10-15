import './privacy.js';

const menu = document.querySelector('#primary-navigation');
const openButton = document.querySelector('.menu-toggle');
const closeButton = document.querySelector('.menu-close');
const menuLinks = [...menu.querySelectorAll('a')];

const isMobileNavigation = () => getComputedStyle(openButton).display !== 'none';

const setMenuState = (isOpen, {restoreFocus = false} = {}) => {
    menu.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    openButton.setAttribute('aria-expanded', String(isOpen));
    openButton.querySelector('.visually-hidden').textContent = isOpen ? 'Close navigation' : 'Open navigation';
    menu.inert = isMobileNavigation() && !isOpen;

    if (isOpen) {
        closeButton.focus();
    } else if (restoreFocus) {
        openButton.focus();
    }
};

const syncNavigationMode = () => {
    if (!isMobileNavigation()) {
        menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        openButton.setAttribute('aria-expanded', 'false');
        menu.inert = false;
        return;
    }

    menu.inert = !menu.classList.contains('is-open');
};

openButton.addEventListener('click', () => {
    setMenuState(openButton.getAttribute('aria-expanded') !== 'true');
});

closeButton.addEventListener('click', () => {
    setMenuState(false, {restoreFocus: true});
});

menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (isMobileNavigation()) {
            setMenuState(false);
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('is-open')) {
        return;
    }

    if (event.key === 'Escape') {
        setMenuState(false, {restoreFocus: true});
        return;
    }

    if (event.key !== 'Tab') {
        return;
    }

    const focusableElements = [closeButton, ...menuLinks];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});

window.addEventListener('resize', syncNavigationMode);
syncNavigationMode();

const faqButtons = [...document.querySelectorAll('.faq-question')];

const setFaqState = (button, isOpen) => {
    const answer = document.querySelector(`#${button.getAttribute('aria-controls')}`);
    answer.classList.toggle('is-opening', isOpen && button.getAttribute('aria-expanded') !== 'true');
    button.setAttribute('aria-expanded', String(isOpen));
    answer.hidden = !isOpen;
};

faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const shouldOpen = button.getAttribute('aria-expanded') !== 'true';

        faqButtons.forEach((faqButton) => {
            setFaqState(faqButton, faqButton === button && shouldOpen);
        });
    });
});

const newsletterForm = document.querySelector('.newsletter-form');
const newsletterEmail = document.querySelector('#newsletter-email');
const newsletterStatus = document.querySelector('#newsletter-status');

const isValidNewsletterEmail = () => newsletterEmail.validity.valid
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value.trim());

newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!isValidNewsletterEmail()) {
        newsletterEmail.setAttribute('aria-invalid', 'true');
        newsletterStatus.textContent = 'Enter a valid email address, like you@example.com';
        newsletterEmail.focus();
        return;
    }

    newsletterEmail.removeAttribute('aria-invalid');
    newsletterStatus.textContent = 'Your email format is valid. Online signup is not connected yet.';
    newsletterForm.reset();
});

newsletterEmail.addEventListener('input', () => {
    if (isValidNewsletterEmail()) {
        newsletterEmail.removeAttribute('aria-invalid');
        newsletterStatus.textContent = '';
    }
});
