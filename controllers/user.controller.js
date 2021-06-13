const userService = require('../routes/services/users.service');

/* POST users login. */
function authenticate(req, res, next) {
    userService.authenticate(req.body.username, req.body.password, res)
        .then(user => {
            res.cookie('_id.jtoken', JSON.stringify(user), { maxAge: 7 * 24 * 3600000, 
                httpOnly: true });
            res.cookie('logged', true, { maxAge: 7 * 24 * 3600000, 
                httpOnly: false, path: '/' });
            res.status(200).send({ user });
        })
        .catch((err) => {
            switch(err.message) {
                case 'MissingParamsError':
                    res.status(400).send('Missing username parameter');
                    break;
                case 'BadCredentialsError' || 'NotFoundError':
                    res.status(401).send('Bad username or password');
                    break;
                default:
                    res.status(500).send('Ooops...something went wrong!');
            }
        })
        .catch(next);
}

function register(req, res, next) {
    userService.register(req.body.mail, req.body.username, req.body.password)
        .then((user) => {
            res.cookie('_id.jtoken', JSON.stringify(user), { maxAge: 7 * 24 * 3600000, 
                httpOnly: true });
            res.cookie('logged', true, { maxAge: 7 * 24 * 3600000, 
                httpOnly: false, path: '/' });
            res.status(200).send({ user })
        })
        .catch((err) => {
            switch (err.message) {
                case 'UsernameTaken':
                    res.status(400).send('Username already taken');
                    break;
                default:
                    res.status(500).send('Ooops...something went wrong!');
            }
        })
        .catch(next);
}

function logout(req, res, next) {
    res.clearCookie('_id.jtoken', { httpOnly: true });
    res.clearCookie('logged', { httpOnly: false, path: '/' });
    res.status(200).send();
}

module.exports = {
    authenticate,
    register,
    logout
}
