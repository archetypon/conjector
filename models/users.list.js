const UsersConnector = require('./util/users.connector');
const User = require('./components/user');
const crypt = require('./util/crypter.service');

const usrConnect = new UsersConnector();

var UserList = function(){
    
   

    return{

        loadUserByName: async function(name){
            let queryData = await usrConnect.read(name);
            let usr;

            if (queryData) {
                usr = new User(JSON.parse(queryData));
                return usr;
            } else {
                return null;
            }
        },

        createUser: async function(mail, usr, pwd) {
            let props = {
                uMail: mail,
                uName: usr,
                uPwd: crypt.encrypt(pwd)
            }

            let user = new User(props);

            await usrConnect.serialize(user);
            return user;
        }

    }
        
};

module.exports = UserList;