// @ts-check

const { langMapping } = require('./lib');

/**
 * @param {string} lang 
 * @param {string} csvPath 
 */
exports.default = function(lang, csvPath) {
    const language = langMapping[lang];
    if (!language) {
        console.warn(`This language is not supported`);
        process.exit(0);
    }
    
    const parse = require('csv-parse/lib/sync')
    const fs = require('fs');
    const buffer = fs.readFileSync(csvPath);
    /** @type {string[][]} */
    const records = parse(buffer, {
        bom: true,
        delimiter: ',',
        quote: '"',
        relax: true,
        skipEmptyLines: true,
    });
    const langIndex = records[0].indexOf(language);
    /** @type {Record<string, string>} */
    const translationMap = {};
    for (let i = 1; i < records.length; i++) {
        const record = records[i];
        translationMap[record[0]] = record[langIndex];
    }
    
    const LANG_FILE_PATH = `./public/lang/${lang}.json`;
    const langFileStr = fs.readFileSync(LANG_FILE_PATH, { encoding: 'utf8' });
    let total = 0;
    let replaced = 0;
    const replacedValue = langFileStr.replace(/\$(\w+)/g, (_, key) => {
        total++;
        if (key in translationMap) {
            replaced++;
            return translationMap[key];
        }
        return _;
    });
    console.log(`Updated ${replaced} of ${total} translation keys in ${LANG_FILE_PATH}`);
    fs.writeFileSync(LANG_FILE_PATH, replacedValue, { encoding: 'utf8' });
}
