const assert = require('assert');
const GraphyConnector = require('../models/util/graphy.connector');
const factory = require('@graphy/core.data.factory');


describe("Graphy connector create Quad from SPARQL query", function () {
    it('check sparql query', async () => {
        let gConnector = new GraphyConnector();
        let res = await gConnector.sparqlQuery(`PREFIX dc: <http://purl.org/dc/elements/1.1/>
                                    CONSTRUCT {
                                        <http://example/book2> dc:title "David Copperfield" ;
                                        dc:creator "Edmund Wells" . }
                                    WHERE {} `);
        assert.strictEqual(res[0].object.value, 'David Copperfield');                           
    });
});

describe("Graphy connector read by subject", function() {
    it('check if read values', async () => {
        let gConnector = new GraphyConnector();
        let pattern = {subject: factory.namedNode('#spiderman')};
        let res = await gConnector.read(pattern);
    })
});

describe("Graphy connector read all", function () {
    it('check if read all values', async () => {
        let gConnector = new GraphyConnector();
        let res = await gConnector.getAll();
    })
})