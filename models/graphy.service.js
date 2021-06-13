const Graphy = require('../models/components/graphy');
const factory = require('@graphy/core.data.factory');
const GraphyConnector = require('./util/graphy.connector');
const PrefixInit = require('./util/prefix.init');

const prefixes = new PrefixInit();
const store = new GraphyConnector();

var GraphyService = function() {

    prefixes.loadPrefixes();

    return {
        writeTurtle: function(assertion, user) {
            return new Promise((resolve, reject) => {
                let resObj = {};
                let turtlGraphy = new Graphy(assertion);
                turtlGraphy.translateTurtle()
                    .then((data) => {
                        turtlGraphy.setGraph(user);
                        turtlGraphy.serialize(user);
                        resObj.graphs = turtlGraphy.getGraphyObj();
                        resolve(resObj);
                    })
                    .catch((err) => {
                        reject();
                    });
            });
        },

        writeNTriple: function(assertion, user) {
            return new Promise((resolve, reject) => {
                let resObj = {};
                let nTGraphy = new Graphy(assertion);
                nTGraphy.translateNTriples()
                    .then(() => {
                        nTGraphy.setGraph(user);
                        nTGraphy.serialize(user);
                        resObj.graphs = nTGraphy.getGraphyObj();
                        resolve(resObj);
                    })
                    .catch(() => {
                        reject();
                    });
            });
        },

        goSPARQL: function(assertion, user) {
            return new Promise((resolve, reject) => {
                let resObj = {};
                let sparqlGraphy = new Graphy(assertion);
                sparqlGraphy.callSPARQL()
                .then(() => {
                    //sparqlGraphy.setGraph(user);
                    resObj.graphs = sparqlGraphy.getGraphyObj();
                    resolve(resObj);
                })
                .catch(() => {
                    reject();
                });
            });
        },
        /*
        returns an object with intepreted RDF and a turtle ontology
          */
        getRDFBySubject: function(subject, opt, user) {
            return new Promise((resolve, reject) => {
                const conjecture = factory.namedNode(subject);

                let pattern = {};
                let gList = [];
                let sList = [];
                pattern.subject = conjecture;

                store.read(pattern).then(async (res) => {
                    if(res) {
                        let data = [];
                        data = res.filter(e => 
                            e.predicate.value !== '/ppp#hasTemplate' &&
                            e.predicate.value !== 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Label');
                        if(data.length > 0)
                            data.forEach((value) => {
                                let graphyObj = new Graphy(value);
                                graphyObj.setGraphyEqualsToConj();
                                graphyObj.render(opt, user)
                                    .then((tData) => {
                                        gList.push(...tData);
                                        graphyObj.toString()
                                        .then((sData) => {
                                            sList.push(sData[1]);
                                            if (sList.length === data.length)
                                                resolve({
                                                    gList: gList,
                                                    sList: sList
                                                });
                                        })
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    });
                            });
                        else
                            resolve({
                                gList: gList,
                                sList: sList
                            });
                    } else   
                        reject();
                    }).catch((err) => {
                        console.log(err);
                        reject();
                    });                 
            });
        },

        translateSPARQL: function(subjects, user) {
            return new Promise((resolve, reject) => {

                if (!Array.isArray(subjects) 
                    || !subjects.length)
                    resolve({
                        gList: ['Nessuna corrispondenza trovata'],
                        sList: ['Nessuna corrispondenza trovata']
                    });

                let gList = [];
                let sList = [];

                subjects.forEach((value) => {
                    let graphyObj = new Graphy(value);
                    graphyObj.setGraphyEqualsToConj();
                    graphyObj.render({tzone: 'utc'}, user)
                        .then((tData) => {
                            gList.push(...tData);
                            graphyObj.toString()
                                .then((sData) => {
                                    sList.push(sData[1]);
                                    if (sList.length === subjects.length)
                                        resolve({
                                            gList: gList,
                                            sList: sList
                                        });
                                })
                                .catch((err) => {
                                    reject(err);
                                })
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    });
            });
        },

        readPresets: function() {
            return new Promise((resolve, reject) => {
                let pattern = {
                    graph: factory.defaultGraph()
                };
                let sList = [];

                store.read(pattern).then(async (res) => {
                    let data = [];
                    data = res.filter(e =>
                        e.predicate.value !== '/ctx#assertedBy' &&
                        e.predicate.value !== '/ctx#assertionDate');
                    data.forEach((value) => {
                        let graphyObj = new Graphy(value);
                        graphyObj.setGraphyEqualsToConj();
                            graphyObj.toString()
                                .then((sData) => {
                                    sList.push(sData[1]);
                                    if (sList.length === data.length)
                                        resolve({
                                            sList: sList
                                        });
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        });
                }).catch((err) => {
                    console.log(err);
                    reject();
                });
            });
        }
    }
}

module.exports = GraphyService;