var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
    "parserOptions": {
        "ecmaVersion": 5,
        "sourceType": "module",
        "ecmaFeatures": {
            "globalReturn": false,
            "impliedStrict": true,
            "jsx": false
        }
    },

    "env": {
        "node": true
    },

    "extends": "standard",

    "rules": {
        "semi": [ "error", "always" ]
    }
};
