
const yargs = require('yargs');
const marklogic = require('marklogic');

const config = require('./config');
const views = require('./views');
const upload = require('./upload');

const withDb = (handler) => {
  let db = marklogic.createDatabaseClient(config.db);
  handler(db)
        .then(() => db.release())
        .catch((e) => {
            db.release();
            console.log('Fehler:', e)
        });
}

const argv = yargs
      .command('upload-documents <directory> <database>', 'Upload files',
               () => {},
               (argv => upload.uploadDirectory(argv)))
      .command('install-view <view-definition-file>', 'Install TDE view definition',
               () => {},
               (argv => withDb((db) => views.installView(db, argv))))
      .demandCommand()
      .argv;
