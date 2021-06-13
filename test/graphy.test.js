const Graphy = require('../models/components/graphy');
const assert = require('assert');


describe("Graphy serialization 1/2", function() {
    it('is the graphy working', async () => {
            let graph = new Graphy(`<#spiderman> a foaf:Person ;
                                    foaf:name "Spiderman" ; 
                                    rdf:Label "Spiderman" .`);
            await graph.translateTurtle();
            await graph.setGraph('Prova');
            await graph.serialize();  
        })
});

describe("Graphy serialization 2/2", function () {
    it('is the graphy working again', async () => {
        let graph = new Graphy(`<#andrea> a foaf:Person ;
                                    foaf:name "Andrea" .`);
        await graph.translateTurtle();
        await graph.serialize();
    });
});

describe("Graphy context", function() {
    it('is context applicable', async() => {
        let graph = new Graphy(`<#elisa> a foaf:Person ;
                                    foaf:name "Elisa" .`);
        await graph.translateTurtle();
        let tmp = graph.getGraphyObj();
        graph.setGraph('Andrea Pagliarani');
        tmp = graph.getGraphyObj();
        await graph.toString();
        assert.ok(graph.getStrinGObj());
    });
})

describe("Graphy context", function () {
    it('is context applicable without prefix', async () => {
        let graph = new Graphy(`<#Padme> a foaf:Person ;
                                    foaf:name "Padme" .`);
        await graph.translateTurtle();
        let tmp = graph.getGraphyObj();
        graph.setGraph('Andrea Pagliarani');
        tmp = graph.getGraphyObj();
        await graph.toString();
        assert.ok(graph.getStrinGObj());
    });
})