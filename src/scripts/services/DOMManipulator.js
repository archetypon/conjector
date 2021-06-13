import React from 'react';
import ReactDOM from 'react-dom';
import ConjectorMenu from '../components/menu';
import Injector from '../components/injector';
import ConjectorLogin from '../components/login';
import ConToast from '../components/toast';
import ConjHelp from '../components/helper';
import Presets from '../components/presets';

let hTexts = [`Conjector è un'applicazione pensata per permettere l'inserimento e 
            la gestione di ontologie e documenti semantici tramite standard RDF.
            Conjector è una creazione di Andrea Pagliarani.`, `Tramite il box di testo "Conjector Injection"
            è possibile introdurre nuovi costrutti semantici e ontologie tramite standard RDF, 
            il sistema al momento riconosce e interpreta le sintassi N-Triple, Turtle e SPARQL, 
            riconoscendo automaticamente alcuni tra i principali prefissi. 
            Non vanno quindi inclusi nella tripla i seguenti prefissi: foaf, rdf, dc, owl ed rdfs.
            Esistono inoltre due particolari prefissi: ppp e ctx, di cui il primo viene utilizzato per 
            definire delle ontologie contenenti template legati a loro volta a termini noti, mentre il
            secondo rimane trasparente all'utente e viene utilizzato per definire il contesto di un'asserzione.
            Le ontologie ppp possono essere personalizzate (e il sistema prediligerà sempre quelle inserite 
            dall'utente nell'interpretazione delle triple) utilizzando la forma (esempio in Turtle) 
            foaf:name ppp:hasTemplate "\${subject} si chiama \${object}".
            È infine possibile interrogare direttamente le triple presenti a sistema, inserendo una condizione
            SPARQL nella forma ?s ?p ?o (e.g. ?s ?p "Alexandre Dumas".).
            Tramite il pulsante in basso è possibile inviare la congettura, che il sistema trasformerà automaticamente
            in un grafo, collegato con il contesto dell'inserimento (utente e data).
            Si consiglia di usare la skolemisation dei nodi anonimi, in quanto il sistema non li 
            gestisce automaticamente.`];
let curHelper = 0;


var Cookie = function() {};

Cookie.prototype.getCookie = function(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function loadMenu() {

    let nav = document.getElementsByTagName('nav');
    ReactDOM.unmountComponentAtNode(nav[0]);

    let cookie = new Cookie();

    let logged = cookie.getCookie('logged');

    const menu = <ConjectorMenu logged={logged === 'true'}></ConjectorMenu>;

    ReactDOM.render(menu, nav[0]);

}

export function loadInjector() {

    curHelper = 1;

    let section = document.getElementsByTagName('section');
    ReactDOM.unmountComponentAtNode(section[0]);

    const injector = <Injector></Injector>;

    ReactDOM.render(injector, section[0]);
}

export function loadPresets() {
    curHelper = 0;

    let section = document.getElementsByTagName('section');
    ReactDOM.unmountComponentAtNode(section[0]);

    const presets = <Presets></Presets>;

    ReactDOM.render(presets, section[0]);
}

export function loadLogin(registered) {

    let section = document.getElementsByTagName('section');
    ReactDOM.unmountComponentAtNode(section[0]);

    const logjector = <ConjectorLogin registered={registered}></ConjectorLogin>;

    ReactDOM.render(logjector, section[0]);

}

export function loadDialog(message) {
    let dialog = document.getElementsByTagName('dialog');
    ReactDOM.unmountComponentAtNode(dialog[0]);

    const conToast = <ConToast toastMessage={message} open={true}></ConToast>;

    ReactDOM.render(conToast, dialog[0]);

}

export function checkLoginStatus() {

    let cookie = new Cookie();

    return cookie.getCookie('logged') === 'true'? true : false;
}


export function openHelper() {
    let dialog = document.getElementsByTagName('dialog');
    ReactDOM.unmountComponentAtNode(dialog[0]);

    const conjHelp = <ConjHelp helperText={hTexts[curHelper]}></ConjHelp>

    ReactDOM.render(conjHelp, dialog[0]);

}

export function loadExample(example) {
    var event = new CustomEvent("changeConjecture", {
        detail: example
    });

    dispatchEvent(event);
}