// @ts-check

const { langMapping } = require('./lib');

/**
 * @param {string} lang 
 * @param {string} csvPath 
 */
exports.default = function(lang, csvPath) {
    const language = langMapping[lang];
    if (!language) {
        console.log(`This language is not supported`);
        process.exit(0);
    }
    
    const parse = require('csv-parse/lib/sync')
    const fs = require('fs');
    const buffer = fs.readFileSync(csvPath);
    const records = parse(buffer, {
        bom: true,
        delimiter: ';',
        quote: '"',
        relax: true,
        skipEmptyLines: true,
        columns: true,
        objname: ' ',
    });
    
    const LANG_FILE_PATH = `./public/lang/${lang}.json`;
    const langFileStr = fs.readFileSync(LANG_FILE_PATH, { encoding: 'utf8' });
    /** @type {Record<string, string>} */
    const langObj = JSON.parse(langFileStr);
    const mapFileStr = fs.readFileSync(`./public/lang/_map.json`, { encoding: 'utf8' });
    /** @type {Record<string, string>} */
    const mapObj = JSON.parse(mapFileStr);
    for (const key in mapObj) {
        const originalId = mapObj[key];
        if (!originalId) { continue; }
        const line = records[originalId];
        if (!line) {
            console.warn(`Missing translation id ${originalId}`);
            continue;
        }
        const translation = line[language];
        langObj[key] = translation;
    }
    
    fs.writeFileSync(LANG_FILE_PATH, JSON.stringify(langObj, null, 4), { encoding: 'utf8' });
}
