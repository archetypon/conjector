const assert = require('assert');
const UserList = require('../models/users.list');

describe("User create", function() {
    it('is the user istantiatable and persistent', async () => {
        let uList = new UserList();
        await uList.createUser('a@a.it', 'Andrea', 'kkk');
        let user = await uList.loadUserByName('Andrea');

        assert.strictEqual(user.getName(), 'Andrea');
        assert.ok(user.checkPwd('kkk'));
        assert.ok(!user.checkPwd('uuuu'));
    });
});

describe("User get", function() {
    it('if I put a wrong name the value should be null', async () => {
        let uList = new UserList();
        let user = await uList.loadUserByName('Caccamo');

        assert.strictEqual(user, null);

        user = await uList.loadUserByName('Andrea');
        assert.strictEqual(user.getName(), 'Andrea');
    })
})