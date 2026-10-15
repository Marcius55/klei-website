// Remove preferences and cookies left by the former Analytics integration.
// This module contains no tracking script, SDK, or external requests.
try {
    localStorage.removeItem('klei-analytics-consent');
} catch {
    // The rest of the site still works when browser storage is unavailable.
}

const hostnameParts = location.hostname.split('.');
const domains = hostnameParts.map((_, index) => hostnameParts.slice(index).join('.'));
document.cookie.split(';').forEach(cookie => {
    const name = cookie.trim().split('=')[0];
    if (name !== '_ga' && !name.startsWith('_ga_')) return;
    const expiry = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = expiry;
    domains.forEach(domain => {
        document.cookie = `${expiry}; Domain=${domain}`;
        document.cookie = `${expiry}; Domain=.${domain}`;
    });
});

const privacy = document.querySelector('.privacy-dialog');
let opener;
document.querySelectorAll('[data-privacy-open]').forEach(button => {
    button.addEventListener('click', () => {
        opener = button;
        privacy.showModal();
    });
});
document.querySelector('[data-privacy-close]').addEventListener('click', () => privacy.close());
privacy.addEventListener('close', () => opener?.focus({preventScroll: true}));
