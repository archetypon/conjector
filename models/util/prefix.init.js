const ttl_read = require('@graphy/content.ttl.read');
const GraphyConnector = require('../util/graphy.connector');
const path = require('path');
const fs = require('fs');

const location = path.join(__dirname, '../../db/default.prefix');

const store = new GraphyConnector();
/**
 * Prefix labels initializer
 */

var PrefixInit = function() {

    return {
        loadPrefixes: function() {
            
            console.log('Importing known prefixes...');

            fs.readdir(location, (err, filename) => {
                if (err) {
                    console.log(err);
                    return;
                }
                store.destroy().then(() => {
                    filename.filter(fn => path.extname(fn) === '.ttl')
                        .forEach((file) => {
                            console.log(`Importing ${file}`);
                            fs.createReadStream(path.join(location, file))
                                .pipe(ttl_read())
                                .on('data', (y_quad) => {
                                    store.serialize(y_quad);
                                })
                                .on('eof', () => {
                                    console.log(`${file} imported.`);
                                })
                                .on('error', (err) => {
                                    console.log(err);
                                });
                        });
                })
                
            });
        }
    }

}

 module.exports = PrefixInit;