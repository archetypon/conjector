const jwt = require('jsonwebtoken');

const UserList = require('../../models/users.list');

const rndSec = rsg.randomString(12);
const secret = process.env.TOKEN_CREDENTIAL || rndSec;

var users = new UserList();

module.exports = {
    authenticate,
    register
};

async function authenticate(username, password) {
    if (!username)
        throw Error('MissingParamsError');
    if (!password)
        throw Error('MissingParamsError');
    
    let curUsr = await users.loadUserByName(username);

    if (!curUsr || !curUsr.checkPwd(password))
        throw Error('BadCredentialsError');
        

    let dataToken = curUsr.getToken();

    // create a jwt token that is valid for 7 days
    const token = jwt.sign(dataToken, secret, { expiresIn: '7d' });

    return token;
}

async function register(mail, username, password) {
    let check = await users.loadUserByName(username);
    if (!check && mail && password) {
        let usr = await users.createUser(mail, username, password);

        let dataToken = usr.getToken();

        // create a jwt token that is valid for 7 days
        const token = jwt.sign(dataToken, secret, { expiresIn: '7d' });
        return token;
    }
    else
        throw new Error('UsernameTaken');
}