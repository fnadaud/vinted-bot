const { BASE_URL, DEFAULT_PARAMS } = require('./config');

function buildVintedUrl(search) {
    const url = new URL(BASE_URL);

    const { search_text, ...overrides } = search;

    url.searchParams.append('search_text', search_text);

    const finalParams = { ...DEFAULT_PARAMS, ...overrides };

    for (const [key, value] of Object.entries(finalParams)) {
        if (value !== null) {
            url.searchParams.append(key, value);
        }
    }

    return url.toString();
}

module.exports = { buildVintedUrl };