const ttl_read = require('@graphy/content.ttl.read');
const nt_read = require('@graphy/content.nt.read');
const factory = require('@graphy/core.data.factory');
const ttl_write = require('@graphy/content.ttl.write');
const GraphyConnector = require('../util/graphy.connector');
const prefixes = require('../../db/default.prefix/known.prefixes.json');
const fs = require('fs');
const path = require('path');
const Interpreter = require('../util/interpreter');
const { v4: uuidv4 } = require('uuid');

const store = new GraphyConnector();

var ttl_prefixes = '';
var sparql_prefixes = '';

fs.readFile(path.join(__dirname, 
    '../../db/default.prefix', 'known.prefixes.ttl'), (err, data) => {
        if(err)
            return;
        ttl_prefixes = data + '';
    });

fs.readFile(path.join(__dirname,
    '../../db/default.prefix', 'known.prefixes.sparql'), (err, data) => {
        if (err)
            return;
        sparql_prefixes = data + '';
    });

/*
* Generic object for Quad manipulation
 */
var Graphy = function(conj) {

    var graphyObj = [];
    var turtleObj = [];
    var renderedObj = [];

    return {

        translateTurtle: function() {
            return new Promise((resolve, reject) => {
                ttl_read(ttl_prefixes + conj, {
                    data(y_quad) {
                        graphyObj.push(y_quad); 
                    }, 
                    eof() {
                        resolve('done');
                    }, 
                    error() {
                        reject('BadSyntax');
                    }
                });
            });
        },

        translateNTriples: function() {
            return new Promise((resolve, reject) => {

                nt_read(conj, {
                    data(y_quad) {
                        graphyObj.push(y_quad);
                    },
                    eof() {
                        resolve('done');
                    },
                    error() {
                        reject('BadSyntax');
                    }
                });

            });
        },

        callSPARQL: function () {
            return new Promise(async (resolve, reject) => {
                
                let res = await store.sparqlQuery(sparql_prefixes + 
                    `SELECT ?s ?p ?o WHERE {` + conj +
                    ` ?s ?p ?o
                    }`).catch(() => {
                    reject('BadSyntax');
                });
                if(res) {
                    Array.from(res).forEach((e) => {
                        let tmp = factory.quad(
                            factory.fromTerm(e['?s']),
                            factory.fromTerm(e['?p']),
                            factory.fromTerm(e['?o'])
                        );
                        graphyObj.push(tmp);
                    });
                    resolve('done');
                } else {
                    reject();
                }
                
            });
        },

        toString: function() {
            return new Promise((resolve, reject) => {
                let ds_writer = ttl_write({
                    prefixes: prefixes
                });
                try {
                    ds_writer
                        .on('data', (data) => {
                            turtleObj.push(data.toString('utf-8'));
                            if (turtleObj.length === graphyObj.length) 
                                resolve(turtleObj);
                        });
                } catch {
                    reject();
                }
                

                graphyObj.forEach((e) => {
                    e.graph = factory.namedNode();
                    ds_writer.write(e);
                })
            })
        },

        render: function(opt, user) {
            return new Promise((resolve, reject) => {
                graphyObj.forEach(async (e) => {
                    const inter = new Interpreter(e);
                    inter.buildTemplate(opt.tzone, user)
                    .then((data) => {
                        if(data)
                            renderedObj.push(data); 
                        else
                            renderedObj.push(e + ' (non interpretabile)');
                        if (renderedObj.length === graphyObj.length)
                            resolve(renderedObj);
                    })
                    .catch((err) => {
                        reject();
                    });
                });
            });
        },

        setGraph: function(context) {
            graphyObj.forEach((e) => {
                let graphUnique = uuidv4();
                e.graph = factory.namedNode(graphUnique);

                store.serialize(factory.quad(...[
                    factory.namedNode(graphUnique),
                    factory.namedNode('/ctx#assertedBy'),
                    factory.namedNode(`${ context }`)
                    ])
                );

                const toDate = new Date();

                store.serialize(factory.quad(...[
                    factory.namedNode(graphUnique),
                    factory.namedNode('/ctx#assertionDate'),
                    factory.dateTime(toDate)
                    ])
                );
            });
        },

        getGraphyObj: function() {
            return graphyObj;
        },

        getStrinGObj: function() {
            return turtleObj;
        },

        getRenderedObj: function() {
            return renderedObj;
        },

        serialize : function(user) {
            graphyObj.forEach((e) => {
                let pattern = {
                    subject: e.subject,
                    predicate: e.predicate
                };

                store.read(pattern).then(async (data) => {
                    if(data.length > 0) {
                        data.forEach(element => {
                            let gPattern = {
                                subject: element.graph,
                                predicate: factory.namedNode('/ctx#assertedBy')
                            };
                            store.read(gPattern)
                                .then(async (data) => {
                                    if (data.length > 0 && 
                                        data[0].object.value === user) {
                                        store.patch(e, element);
                                    } else {
                                        store.serialize(e);
                                    }
                                });
                        });
                    } else {
                        store.serialize(e);
                    }
                }).catch((err) => {
                    console.log(err);
                });

            });
            
        },

        setGraphyEqualsToConj: function() {
            graphyObj.push(conj);
        }
    }
}

module.exports = Graphy;