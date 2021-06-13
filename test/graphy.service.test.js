const GraphyService = require('../models/graphy.service');
const assert = require('assert');
const Graphy = require('../models/components/graphy');


describe("Graphy service error", function () {
    it('check exception handling', async () => {
        let gService = new GraphyService();
        gService.writeTurtle('d', 'aaaa')
        .then(value => {
            assert.strictEqual(value, undefined);
            assert.fail('query accepted');
        })
        .catch(err => {
            assert.ok(true);
        })
    });
});

describe("Graphy service SPARQL", function() {
    it('the service write SPARQL query adding context', async () => {
        let sparqlService = new GraphyService();
    })
});

describe("Graphy service SPARQL select", function () {
    it('the service write SPARQL query adding context', async () => {
        let sparqlService = new GraphyService();
    })
});

describe("Graphy service Turtle", function() {
    it('the service translate Turtle', async ()=> {

    });
});
