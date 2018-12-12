module.exports = {
    parser: 'babel-eslint',
    extends: 'airbnb',

    rules: {
        'react/jsx-filename-extension': 0,
        'no-unused-vars': 0,
        'react/prop-types': 0,
    },

    env: {
        browser: true,
        mocha: true
    },
}
