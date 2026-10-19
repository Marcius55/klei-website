const measurementId = 'G-N83662NFNF';
const consentKey = 'klei-analytics-consent';
const consentLifetime = 180 * 24 * 60 * 60 * 1000;
const banner = document.querySelector('.cookie-banner');
const settings = document.querySelector('[data-cookie-settings]');
const status = document.querySelector('#cookie-status');
const privacy = document.querySelector('.privacy-dialog');
let analyticsLoaded = false;
let privacyOpener;

// Queue consent commands locally. No Google script is loaded at this point.
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
window[`ga-disable-${measurementId}`] = true;
const denied = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
};
window.gtag('consent', 'default', denied);
window.gtag('set', 'ads_data_redaction', true);

const readConsent = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(consentKey));
        return saved?.version === 2 && Number.isFinite(saved.expires) && saved.expires > Date.now()
            && ['granted', 'denied'].includes(saved.choice) ? saved.choice : null;
    } catch {
        return null;
    }
};

const saveConsent = (choice) => {
    try {
        localStorage.setItem(consentKey, JSON.stringify({version: 2, choice, expires: Date.now() + consentLifetime}));
        return true;
    } catch {
        // A failed write must not leave an older acceptance behind if storage
        // still permits removal (for example, when its quota is exhausted).
        try { localStorage.removeItem(consentKey); } catch { /* Storage blocked. */ }
        return false;
    }
};

const clearAnalyticsCookies = () => {
    const labels = location.hostname.split('.');
    const domains = labels.map((_, index) => labels.slice(index).join('.'));
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
};

const enableAnalytics = () => {
    window[`ga-disable-${measurementId}`] = false;
    window.gtag('consent', 'update', {...denied, analytics_storage: 'granted'});
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    // Initialize once, and only after consent has been granted.
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {allow_google_signals: false, allow_ad_personalization_signals: false});
    const script = document.createElement('script');
    script.id = 'klei-google-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
};

const disableAnalytics = () => {
    // Disable collection before updating consent: a denied update alone can
    // permit cookieless pings from a previously loaded Google tag.
    window[`ga-disable-${measurementId}`] = true;
    window.gtag('consent', 'update', denied);
    clearAnalyticsCookies();
};

document.querySelectorAll('[data-consent]').forEach(button => {
    button.addEventListener('click', () => {
        const choice = button.dataset.consent;
        const remembered = saveConsent(choice);
        if (choice === 'granted') enableAnalytics();
        else disableAnalytics();
        banner.hidden = true;
        status.textContent = `${choice === 'granted' ? 'Analytics accepted.' : 'Analytics rejected.'}${remembered ? '' : ' Your browser could not remember this choice.'}`;
        settings.focus({preventScroll: true});
    });
});

settings.addEventListener('click', () => {
    banner.hidden = false;
    banner.querySelector('[data-consent]').focus({preventScroll: true});
});

document.querySelectorAll('[data-privacy-open]').forEach(button => {
    button.addEventListener('click', () => {
        privacyOpener = button;
        privacy.showModal();
    });
});
document.querySelector('[data-privacy-close]').addEventListener('click', () => privacy.close());
privacy.addEventListener('close', () => privacyOpener?.focus({preventScroll: true}));

const choice = readConsent();
if (choice === 'granted') enableAnalytics();
else disableAnalytics();
banner.hidden = choice !== null;

// Apply consent changes made in another tab and re-check expiry on return.
const refreshConsent = () => {
    const choice = readConsent();
    if (choice === 'granted') enableAnalytics();
    else disableAnalytics();
    banner.hidden = choice !== null;
};
window.addEventListener('storage', event => {
    if (event.key === consentKey || event.key === null) refreshConsent();
});
window.addEventListener('focus', refreshConsent);
