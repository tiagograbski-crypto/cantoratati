const GITHUB_PAT_KEY = 'cantoratati_github_pat';

export function getGithubPat() {
    return sessionStorage.getItem(GITHUB_PAT_KEY) || '';
}

export function setGithubPat(token) {
    const trimmed = token.trim();
    if (trimmed) {
        sessionStorage.setItem(GITHUB_PAT_KEY, trimmed);
    } else {
        sessionStorage.removeItem(GITHUB_PAT_KEY);
    }
}

function toBase64Utf8(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function saveAgendaToGithub({ repo, path, payload }) {
    const token = getGithubPat();
    if (!token) {
        const error = new Error('Token GitHub não configurado.');
        error.code = 'NO_TOKEN';
        throw error;
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };

    let sha;
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, { headers });
    if (getRes.ok) {
        const current = await getRes.json();
        sha = current.sha;
    } else if (getRes.status !== 404) {
        throw new Error(`GitHub leitura falhou (${getRes.status}).`);
    }

    const body = JSON.stringify(payload, null, 2) + '\n';
    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'chore(agenda): atualizar disponibilidade',
            content: toBase64Utf8(body),
            sha,
        }),
    });

    if (!putRes.ok) {
        const detail = await putRes.json().catch(() => ({}));
        throw new Error(detail.message || `GitHub gravação falhou (${putRes.status}).`);
    }

    return putRes.json();
}
