// @ts-check
const fs = require('fs');
const path = require('path');

const LANG_DIR = './public/lang';

/**
 * @param {number} value
 * @param {number} width
 * @param {string} padding
 * @returns {string}
 */
function padStart(value, width, padding) {
    let str = String(value);
    while (str.length < width) {
        str = padding + str;
    }
    return str;
}

exports.default = function() {
    /** @type {Set<string>} */
    const allKeys = new Set();
    /** @type {Record<string, Set<string>>} */
    const perLangKeys = {};
    fs.readdirSync(LANG_DIR).forEach(file => {
        const lang = path.parse(file).name;
        if (file.endsWith('_map.json')) return;
        try {
            const filePath = path.join(LANG_DIR, file);
            const content = fs.readFileSync(filePath, { encoding: 'utf8' });
            const obj = JSON.parse(content);
            perLangKeys[lang] = new Set();
            for (const key in obj) {
                allKeys.add(key);
                perLangKeys[lang].add(key);
            }
        } catch {
            console.error(`[FAIL] reading language file for lang='${file}'`);
        }
    });

    if (Object.values(perLangKeys).every(set => set.size === allKeys.size)) {
        console.log(`[GOOD] Everything is great, every file contains ${allKeys.size} entries`);
        return;
    }
    console.log(Object.keys(perLangKeys).map(str => ` ${str} `).join('|') + '| #key');
    const values = Object.values(perLangKeys);
    for (const key of allKeys) {
        if (key.endsWith('.tags')) continue;
        if (values.every(set => set.has(key))) continue;
        console.log(values.map(set => set.has(key) ? '  +' : '  -').join(' |') + ` | ${key}`);
    }
    console.log(values.map(() => '----').join('+') + '+----');
    console.log(values.map(set => padStart(set.size, 4, ' ')).join('|') + '|' + padStart(allKeys.size, 4, ' '));
}
