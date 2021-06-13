const crypt = require('../util/crypter.service');

var User = function (params) {

    var uName = params.uName;
    var uPwd = crypt.decrypt(params.uPwd);
    var uMail = params.uMail;
    var uRate = params.uRate;
    var totalVotes = params.totalVotes;

    return {
        //check if pwd is correct
        checkPwd: function (pwd) {
            return (pwd === uPwd);
        },
        //get token creation data
        getToken: function () {
            let toReturn = { usr: uName, rate: uRate };
            return toReturn;
        },

        setRate: function(newVote) {
            uRate = (uRate+newVote)/++totalVotes;
        },

        getName: function() {
            return uName;
        },

        toJSON: function() {
            params = {
                uName: uName,
                uPwd: crypt.encrypt(uPwd),
                uMail: uMail,
                uRate: uRate,
                totalVotes: totalVotes
            }

            return JSON.stringify(params);
        }

    }

}

module.exports = User;