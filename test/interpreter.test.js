const Interpreter = require('../models/util/interpreter');
const Graphy = require('../models/components/graphy');
const assert = require('assert');

describe('Intepreter service works', function() {
    it('Try to interpret existing quad', async () => {

        let turtlGraphy = new Graphy(`<#spiderman> a foaf:Person ;
                                    foaf:name "Spiderman" ; 
                                    rdf:Label "Spiderman" .`);
        turtlGraphy.translateTurtle()
            .then(() => {
                turtlGraphy.setGraph('Prova');
                turtlGraphy.serialize();
                const inter = new Interpreter(turtlGraphy.getGraphyObj()[1]);
                inter.buildTemplate()
                .then(() => {
                    console.log(inter.render());
                })
            })
            .catch((err) => {
                console.log(err);
                reject();
            });
    })
})