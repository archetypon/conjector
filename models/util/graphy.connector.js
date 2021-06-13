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

    return {
        serialize: async function(quad) {
            await store.multiPut(quad)
            .catch((err) => {
                store.put(quad)
                .catch((err) => {
                    console.log(err);
                })
            });
        },

        patch: async function(newQuad, oldQuad) {
            await store.patch(oldQuad, newQuad)
            .catch((err) => {
                console.log(err, 1);
            });
        },

        read: async function(match) {
            let { items } = await store.get(match)
                .catch((err) => {
                    console.log(err);
                });
            return items;
        },

        getAll: async function() {
            let { items } = await store.get({})
            .catch((err) => {
                console.log(err);
            });;
            return items;
        },

        sparqlQuery: async function(query) {
            let { type, items } = await store.sparql(query)
            .catch((err) => {
                console.log(err);
            });;
            return items;
        },

        destroy: async function() {
            let { items } = await store.get({})
                .catch((err) => {
                    console.log(err);
                });;
            await store.multiDel(items);
        }
    }
}

module.exports = GraphyConnector;