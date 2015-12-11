var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
    "env": {
        "node": true
    },

    "extends": "eslint:recommended",

    "rules": {
        // Possible Errors (overrides from recommended set)
        "no-extra-parens": ERROR,
        "no-unexpected-multiline": ERROR,
        // All JSDoc comments must be valid
        "valid-jsdoc": [ ERROR, {
            "requireReturn": false,
            "requireReturnDescription": false,
            "requireParamDescription": true,
            "prefer": {
                "return": "returns"
            }
        }]
    }
};
