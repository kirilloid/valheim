const fs = require('fs');

// @ts-check
const [_node, _program, ...args] = process.argv;

switch (args[0]) {
    case 'generate':
        if (args.length < 2) {
            console.log(`Requires language param\nUsage: ${_program} generate en|ru|... path/to/translation.file`);
            process.exit(0);
        }        
        const lang = args[1].trim();
        if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
            console.log(`Language param should be xx, or xx-XX code format`);
            process.exit(0);
        }
        const csvPath = args[2];
        if (!fs.existsSync(csvPath)) {
            console.log(`Cannot find file on this path`);
            process.exit(0);
        }
        require('./generate')(lang, csvPath);
        process.exit(0);
    case 'check':
        require('./check').default();
        process.exit(0);
    default:
        console.log(`Requires language param\nUsage: ${_program}
        generate en|ru|...
        check
`);
}
