// Liste des mots vides français à ignorer dans la recherche
const STOP_WORDS = new Set([
    "le", "la", "les", "un", "une", "des", "de", "du", "d", "l",
    "a", "au", "aux", "et", "ou", "en", "pour", "sur", "dans", "avec", "par", "ce", "ces"
]);

function getLevenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    )
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function getWordSimilarity(word1, word2) {
    const distance = getLevenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    if (maxLength === 0) return 100;
    return ((maxLength - distance) / maxLength) * 100;
}

function checkRelevance(title, searchText, minSimilarity = 95) {
    if (!minSimilarity || minSimilarity <= 0) return true;

    const normalize = (str) => {
        return str.toLowerCase()
                  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^\w\s]/gi, ' ');
    };

    const cleanTitle = normalize(title);
    const cleanSearch = normalize(searchText);

    // On découpe la recherche en mots et on exclut ceux présents dans STOP_WORDS
    let searchWords = cleanSearch.split(/\s+/).filter(word => word.length > 0 && !STOP_WORDS.has(word));

    // Sécurité : si la recherche ne contenait QUE des mots de liaison, on annule le filtre pour ne pas faire planter le script
    if (searchWords.length === 0) {
        searchWords = cleanSearch.split(/\s+/).filter(word => word.length > 0);
    }

    if (searchWords.length === 0) return true;
    
    const titleWords = cleanTitle.split(/\s+/).filter(word => word.length > 0);
    if (titleWords.length === 0) return false;

    let totalSimilarity = 0;

    for (const searchWord of searchWords) {
        let bestMatchScore = 0;

        for (const titleWord of titleWords) {
            const score = getWordSimilarity(searchWord, titleWord);
            if (score > bestMatchScore) {
                bestMatchScore = score;
            }
        }
        totalSimilarity += bestMatchScore;
    }

    const averageSimilarity = totalSimilarity / searchWords.length;
    
    return averageSimilarity >= minSimilarity;
}

module.exports = { checkRelevance };