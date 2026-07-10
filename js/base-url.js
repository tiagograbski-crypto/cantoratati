export function getBaseUrl() {
    return import.meta.env.BASE_URL || '/';
}

export function asset(path) {
    return `${getBaseUrl()}${path.replace(/^\//, '')}`;
}
