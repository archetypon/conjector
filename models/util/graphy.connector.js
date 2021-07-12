const Quadstore = require('quadstore').Quadstore;
const leveldown = require('leveldown');
const path = require('path');

const location = path.join(__dirname, '../../db/rdf');

const db = leveldown(location);

const opts = {
    backend: db
}

const store = new Quadstore(opts);

store.open();

var GraphyConnector = function () {

    let checkStat = () => {
        return new Promise((resolve) => {
            while (store.db.status == 'opening') { }
            resolve();
        })
    }

    return {
        serialize: async function (quad) {
            await checkStat();
            await store.multiPut(quad)
                .catch((err) => {
                    store.put(quad)
                        .catch((err) => {
                            console.log(err);
                        })
                });
        },

        patch: async function (newQuad, oldQuad) {
            await checkStat();
            await store.patch(oldQuad, newQuad)
                .catch((err) => {
                    console.log(err, 1);
                });
        },

        read: async function (match) {
            await checkStat();
            let { items } = await store.get(match)
                .catch((err) => {
                    console.log(err);
                });
            return items;
        },

        getAll: async function () {
            await checkStat();
            let { items } = await store.get({})
                .catch((err) => {
                    console.log(err);
                });;
            return items;
        },

        sparqlQuery: async function (query) {
            await checkStat();
            let { type, items } = await store.sparql(query)
                .catch((err) => {
                    console.log(err);
                });;
            return items;
        },

        destroy: async function () {
            await checkStat();
            let { items } = await store.get({})
                .catch((err) => {
                    console.log(err);
                });;
            await store.multiDel(items);
        }
    }
}

module.exports = GraphyConnector;