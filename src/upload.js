
const fs = require('fs');
const path = require('path');
const marklogic = require('marklogic');
const glob = require('glob');

const config = require('./config');

const uploadDirectory = async ({ directory, database }) => {
    let db = marklogic.createDatabaseClient({ ...config.db, database });
    const directoryWithoutSlash = directory.replace(/\/*$/, '');
    const files = glob.sync(`${directoryWithoutSlash}/**/*`, { nodir: true })
          .map(path => { return {
              uri: path.substring(directoryWithoutSlash.length),
              content: fs.readFileSync(path)
          }});
    await db.documents.write(files).result();
    
    db.release();
}

exports.uploadDirectory = uploadDirectory;
