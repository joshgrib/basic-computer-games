/**
 * Program to find games that are missing solutions in a given language
 * 
 * Scan each game folder, check for a folder for each language, and also make
 * sure there's at least one file of the expected extension and not just a
 * readme or something
 */

const fs = require('fs');
const glob = require('glob');

// relative path to the repository root
const ROOT_PATH = '.';

const languages = [
    { name: 'csharp', extension: 'cs' },
    { name: 'java', extension: 'java' },
    { name: 'javascript', extension: 'js' },
    { name: 'pascal', extension: 'pas' },
    { name: 'perl', extension: 'pl' },
    { name: 'python', extension: 'py' },
    { name: 'ruby', extension: 'rb' },
    { name: 'vbnet', extension: 'vb' },
];

const getFilesRecursive = async (path, extension) => {
    return new Promise((resolve, reject) => {
        glob(`${path}/**/*.${extension}`, (err, matches) => {
            if (err) {
                reject(err);
            }
            resolve(matches);
        });
    });
}

const getPuzzleFolders = () => {
    return fs.readdirSync(ROOT_PATH, { withFileTypes: true })
        .filter(dirEntry => dirEntry.isDirectory())
        .filter(dirEntry => !['.git', 'node_modules'].includes(dirEntry.name))
        .map(dirEntry => dirEntry.name);
}

(async () => {
    let missing = [];
    let missingGames = {};
    let missingLanguageCounts = {};
    const puzzles = getPuzzleFolders();
    for (const puzzle of puzzles) {
        for (const { name: language, extension } of languages) {
            const files = await getFilesRecursive(`${ROOT_PATH}/${puzzle}/${language}`, extension);
            if (files.length === 0) {
                missing.push(`${puzzle}/${language}`);
                if (!missingGames[puzzle]) {
                    missingGames[puzzle] = [];
                }
                if (!missingLanguageCounts[language]) {
                    missingLanguageCounts[language] = 0;
                }
                missingGames[puzzle].push(language);
                missingLanguageCounts[language]++;
            }
        }
    }
    if (missing.length === 0) {
        console.log('All games have solutions for all languages')
    } else {
        console.log(`Missing ${missing.length} implementations:`);

        console.log(`\nMissing languages by game:`);
        for (const [puzzle, languages] of Object.entries(missingGames)) {
            console.log(`${puzzle}: ${languages.join(', ')}`);
        }

        console.log(`\nBy language:`);
        for (const [language, count] of Object.entries(missingLanguageCounts)) {
            console.log(`${language}: ${count} missing`);
        }
    }
})();

return;