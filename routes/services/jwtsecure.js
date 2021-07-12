const expressJwt = require('express-jwt');
const rsg = require('../../models/util/random.string.generator');

const rndSec = rsg.randomString(12);

module.exports = jwt;

function jwt() {
    const secret = process.env.TOKEN_CREDENTIAL || rndSec;
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