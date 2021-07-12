const level = require('level');
const path = require('path');

const location = path.join(__dirname, '../../db/friends');

var options = {
    keyEncoding: 'utf8',
    valueEncoding: 'json'
};

const db = level(location, options);

db.open(null, (error) => {
    if (error)
        console.log(error);
});

var UsersConnector = function () {

    let checkStat = () => {
        return new Promise((resolve) => {
            while (db.db.status == 'opening') { }
            resolve();
        })
    }

    return {
        serialize: async function (user) {
            await checkStat();
            await db.put(user.getName(), user.toJSON());
        },

        read: function (user) {
            return new Promise(prom => {
                if (!user)
                    return;
                checkStat()
                    .then(() => {
                        db.get(user, (err, value) => {
                            if (err)
                                prom(null);
                            else {
                                let ret = value;
                                prom(ret);
                            }
                        });
                    })
            });
        }
    }
}

module.exports = UsersConnector;