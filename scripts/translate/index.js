const fs = require('fs');

// @ts-check
const [_node, _program, ...args] = process.argv;

switch (args[0]) {
    case 'generate':
    case 'apply':
        if (args.length < 2) {
            console.warn(`Requires language param\nUsage: ${_program} generate en|ru|... path/to/translation.file`);
            process.exit(0);
        }        
        const lang = args[1].trim();
        if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
            console.warn(`Language param should be xx, or xx-XX code format`);
            process.exit(0);
        }
        const csvPath = args[2];
        if (!fs.existsSync(csvPath)) {
            console.warn(`Cannot find file on this path`);
            process.exit(0);
        }
        // WARN: ensure only limited allowed values are passed
        const module = require(`./${args[0]}`);
        module.default(lang, csvPath);
        process.exit(0);
    case 'check':
        require('./check').default();
        process.exit(0);
    default:
        console.log(`Requires language param\nUsage: ${_program}
        apply en|ru|... path/to/translation.file
        generate en|ru|... path/to/translation.file
        check
`);
}
