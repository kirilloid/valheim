// @ts-check
const [_node, _program, arg] = process.argv;

if (!arg) {
    console.log(`Requires language param\nUsage: ${_program} [en|ru|...]`);
    process.exit(0);
}
const lang = arg.trim();
if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
    console.log(`Language param should be xx, or xx-XX code format`);
    process.exit(0);
}

const langMapping = {
    'en': 'English',
    'sv': 'Swedish',
    'fr': 'French',
    'it': 'Italian',
    'de': 'German',
    'es': 'Spanish',
    'eu': 'Russian',
    'ro': 'Romanian',
    'bg': 'Bulgarian',
    'mk': 'Macedonian',
    'fi': 'Finnish',
    'da': 'Danish',
    'no': 'Norwegian',
    'is': 'Icelandic',
    'tr': 'Turkish',
    'lt': 'Lithuanian',
    'cs': 'Czech',
    'hu': 'Hungarian',
    'sk': 'Slovak',
    'pl': 'Polish',
    'nl': 'Dutch',
    'pt-PT': 'Portuguese_European',
    'pt-BR': 'Portuguese_Brazilian',
    'zh-CN': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'hi': 'Hindi',
    'th': 'Thai',
    'hr': 'Croatian',
    'ka': 'Georgian',
    'el': 'Greek',
    'sr': 'Serbian',
    'uk': 'Ukrainian',
};
const language = langMapping[lang];
if (!language) {
    console.log(`This language is not supported`);
    process.exit(0);
}

const parse = require('csv-parse/lib/sync')
const fs = require('fs');
const buffer = fs.readFileSync('./disasm/translations.csv');
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
