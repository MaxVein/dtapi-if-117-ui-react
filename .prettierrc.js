module.exports = {
    printWidth: 100,
    tabWidth: 4,
    singleQuote: true,
    semi: true,
    trailingComma: 'all',
    arrowParens: 'always',
    endOfLine: 'auto',
    parser: 'flow',
    overrides: [
        {
            files: '*.{js,jsx,tsx,ts,scss,json,html}',
            options: {
                tabWidth: 4,
            },
        },
    ],
};
