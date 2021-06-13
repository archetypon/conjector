const GraphyService = require('../models/graphy.service');
const gService = new GraphyService();

module.exports = {
    writeConjecture,
    findBySubject,
    getPresets
};

async function writeConjecture(req, res) {
    
    gService.writeTurtle(req.body.predicate, req.user.usr)
    .then((data) => {
        res.status(200).send({ graphyObj: data,
        sparql: false });
    })
    .catch((err) => {
        gService.writeNTriple(req.body.predicate, req.user.usr)
            .then((data) => {
                res.status(200).send({ graphyObj: data,
                sparql: false });
            })
            .catch((err) => {
                gService.goSPARQL(req.body.predicate, req.user.usr)
                    .then((data) => {
                        let gConn = [];
                        let sConn = [];

                        gService.translateSPARQL(data.graphs, req.user.usr)
                            .then((data) => {
                                gConn.push(...data.gList);
                                sConn.push(...data.sList);
                                res.status(200).send({
                                    graphyList: gConn,
                                    strList: sConn,
                                    sparql: true
                                });
                            })
                            .catch((err) => {
                                res.status(500).send();
                            });
                    })
                    .catch((err) => {
                        res.status(500).send();
                    });
            });
    });

}

async function findBySubject(req, res) {

    let gConn = [];
    let sConn = [];
    let counter = 0;

    if(req.query.subject instanceof Array) {
        conQuer = Array.from(new Set(req.query.subject));
    } else {
        conQuer = [req.query.subject];
    }

    let opt = {
        tzone: req.query.timezone
    };

    conQuer.forEach((e) => {
        gService.getRDFBySubject(e, opt, req.user.usr)
            .then((data) => {
                gConn.push(...data.gList);
                sConn.push(...data.sList);
                if(++counter === conQuer.length) {
                    res.status(200).send({
                        graphyList: gConn,
                        strList: sConn
                    });
                }
            })
            .catch((err) => {
                res.status(500).send();
            });  
        
    });

}

async function getPresets(req, res) {
    gService.readPresets()
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send();
    })
}