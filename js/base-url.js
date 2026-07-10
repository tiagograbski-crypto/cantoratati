export function getBaseUrl() {
    if (import.meta.env?.BASE_URL) return import.meta.env.BASE_URL;

    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'cantoratati') return '/cantoratati/';
    return '/';
}

export function asset(path) {
    return `${getBaseUrl()}${path.replace(/^\//, '')}`;
}
