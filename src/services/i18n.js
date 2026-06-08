// i18n.js - initializes i18next (using global i18next loaded via CDN)
export async function initI18n() {
    if (typeof window.i18next === 'undefined') {
        console.warn('i18next not found on window, skipping i18n initialization.');
        return;
    }

    const i18n = window.i18next;
    const HttpBackend = window.i18nextHttpBackend;
    const LanguageDetector = window.i18nextBrowserLanguageDetector;

    i18n.use(HttpBackend).use(LanguageDetector).init({
        fallbackLng: 'es',
        load: 'languageOnly',
        debug: false,
        backend: {
            loadPath: 'assets/locales/{{lng}}.json?v=' + new Date().getTime()
        },
        detection: {
            order: ['querystring', 'localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

    // Wait until resources are loaded
    await new Promise((resolve) => {
        if (i18n.isInitialized) return resolve();
        i18n.on('initialized', () => resolve());
    });

    // Apply translations to elements with data-i18n
    function updateTexts() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            if (key.includes('[placeholder]')) {
                const actualKey = key.replace('[placeholder]', '');
                el.setAttribute('placeholder', i18n.t(actualKey));
            } else if (key.includes('[value]')) {
                const actualKey = key.replace('[value]', '');
                el.value = i18n.t(actualKey);
            } else {
                el.innerText = i18n.t(key);
            }
        });

        // Support explicit placeholder/value attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const k = el.getAttribute('data-i18n-placeholder');
            if (!k) return;
            el.setAttribute('placeholder', i18n.t(k));
        });
        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const k = el.getAttribute('data-i18n-value');
            if (!k) return;
            el.value = i18n.t(k);
        });

        // Support aria-label and title from attributes
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const k = el.getAttribute('data-i18n-aria');
            if (!k) return;
            el.setAttribute('aria-label', i18n.t(k));
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const k = el.getAttribute('data-i18n-title');
            if (!k) return;
            el.setAttribute('title', i18n.t(k));
        });

        // Update navigation links that use data-i18n attributes
        const currentLang = i18n.language || 'es';
        const label = currentLang.substring(0,2).toUpperCase();
        const cl = document.getElementById('currentLanguageLabel');
        if (cl) cl.innerText = label;
        const clm = document.getElementById('currentLanguageLabelMobile');
        if (clm) {
            const name = i18n.t('language_name_' + (currentLang.substring(0,2) || 'es'));
            clm.innerText = name;
        }

        // update active class on language selectors
        document.querySelectorAll('[data-lang]').forEach(a => {
            if (a.getAttribute('data-lang') === (i18n.language || '').substring(0,2)) a.classList.add('active');
            else a.classList.remove('active');
        });
    }

    // Initial apply
    updateTexts();

    // Listen for language changes (from external calls)
    i18n.on('languageChanged', () => {
        updateTexts();
        if (window.AuthService && typeof window.AuthService.updateHeaderUI === 'function') {
            window.AuthService.updateHeaderUI();
        }
        if (typeof window.handleLanguageChange === 'function') {
            window.handleLanguageChange();
        }
        if (typeof window.updateAccessibilityButtons === 'function') {
            window.updateAccessibilityButtons();
        }
    });

    // Attach click handlers to elements with data-lang
    document.addEventListener('click', (e) => {
        const target = e.target.closest && e.target.closest('[data-lang]');
        if (target) {
            e.preventDefault();
            const lang = target.getAttribute('data-lang');
            if (lang) {
                i18n.changeLanguage(lang);
            }
        }
    });

    // Expose helper
    window._i18n = i18n;
    window.updateI18nTexts = updateTexts;
    return i18n;
}
