const GraphyConnector = require('../util/graphy.connector');
const factory = require('@graphy/core.data.factory');
const { DateTime } = require('luxon');

const store = new GraphyConnector();

var Interpreter = function(obj) {

    let tmp = {};
    let counter = 0;
    let tmoPosition = ["subject", "predicate", "context", "contextDate"];
    let toFindSubj = [obj.subject, obj.predicate,
    obj.graph, obj.graph];

    let toFindPred = [factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#Label'),
    factory.namedNode('/ppp#hasTemplate'), factory.namedNode('/ctx#assertedBy'),
    factory.namedNode('/ctx#assertionDate')];

    switch (obj.object.termType) {
        case 'Literal':
            tmp.object = obj.object.value;
            break;
        default:
            tmoPosition.push('object');
            toFindSubj.push(obj.object);
            toFindPred.push(factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#Label'));
    }

    let render = () => {

        let ctx = tmp.contextDate ? `In data ${tmp.contextDate}, `: '';
        ctx += tmp.context ? `${tmp.context} afferma che: `: '';

        if (tmp.predicate) {
            tmp.predicate = tmp.predicate.replace(/\${subject}/, tmp.subject);
            tmp.predicate = tmp.predicate.replace(/\${object}/, tmp.object);

            return {
                ctx: ctx,
                predicate: tmp.predicate
            }
        } else {
            return {
                ctx: ctx, 
                predicate: `${obj.subject.value} ${obj.predicate.value} 
                    ${obj.object.value}`
                }
        }
    };

    let parse = (bChoice, tzone, index) => {
        return new Promise((resolve, reject) => {
            if (bChoice) {
                if (bChoice.object.datatype && bChoice.object.datatype.value ===
                    'http://www.w3.org/2001/XMLSchema#dateTime') {
                    
                    let dat = DateTime
                        .fromISO(bChoice.object.value.slice(0, -1), { zone: 'utc' })
                        .setZone(tzone || 'utc');
                    const ye = new Intl
                        .DateTimeFormat('it', { year: 'numeric' }).format(dat);
                    const mo = new Intl
                        .DateTimeFormat('it', { month: 'long' }).format(dat);
                    const da = new Intl
                        .DateTimeFormat('it', { day: '2-digit' }).format(dat);
                    const hr = new Intl
                        .DateTimeFormat('it', {
                            hour: 'numeric',
                            minute: 'numeric', second: 'numeric',
                            hour12: false
                        }).format(dat);
                    tmp[tmoPosition[index]] = `${da} ${mo} ${ye} alle ${hr}`;
                }
                else
                    tmp[tmoPosition[index]] =
                        bChoice.object.value;
            }
            resolve();
        });
    };

    return {
        buildTemplate: async function(tzone, user) {
            return new Promise(async (resolve, reject) => {
                toFindSubj.forEach((e, index) => {
                    let pattern = {
                        predicate: toFindPred[index],
                        subject: e
                    };
                    store.read(pattern)
                        .then((data) => {
                            let bChoice = data[0];
                            let guard = false;
                            let bCounter = 0;

                            if(user) {
                                if(data.length)
                                    data.forEach((found) => {
                                        let cPattern = {
                                            subject: found.graph,
                                            predicate: factory.namedNode('/ctx#assertedBy')
                                        };
                                        store.read(cPattern)
                                            .then((authors) => {
                                                if (found.graph.termType ===
                                                    'DefaultGraph' && !guard)
                                                    bChoice = found;
                                                else if (authors[0].object.value === user) {
                                                    guard = true;
                                                    bChoice = found;
                                                }
                                                parse(bChoice, tzone, index).then(() => {
                                                    if (++bCounter === data.length)
                                                        if (++counter === toFindSubj.length)
                                                            resolve(render());
                                                }).catch(() => {
                                                    reject();
                                                });

                                            }).catch((err) => {
                                                reject(err);
                                            });
                                    });
                                else
                                    parse(bChoice, tzone, index).then(() => {
                                        if (++counter === toFindSubj.length)
                                            resolve(render());
                                    }).catch(() => {
                                        reject();
                                    });
                            }
                        })
                        .catch((err) => {
                            reject(err);
                        })
                })
            });            
        }
    }
}

module.exports = Interpreter;