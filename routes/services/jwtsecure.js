const expressJwt = require('express-jwt');
const config = require('../../private/token_credentials.json');

module.exports = jwt;

function jwt() {
    const { secret } = config;
    return expressJwt({ secret, 
        getToken: function(req) {
            let token = req.cookies['_id.jtoken'];
            if(token)
                return token.replace(/^"(.*)"$/, '$1');
            else
                return null;
        },
        algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            /\/login/,
            /\/api\/users\/.*/,
            /\/public\/.*/
        ]
    });
}