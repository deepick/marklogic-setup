const fs = require("fs");
const yargs = require("yargs");
const marklogic = require("marklogic");
const jp = require("jsonpath");

const config = require("./config");
const views = require("./views");
const upload = require("./upload");

const withDb = (handler) => {
  let db = marklogic.createDatabaseClient(config.db);
  handler(db)
    .then(() => db.release())
    .catch((e) => {
      db.release();
      console.log("Fehler:", e);
    });
};

const queryOneValue = (config, path) => {
  const values = [...new Set(jp.query(config, path))];
  switch (values.length) {
    case 0:
      throw new Error(`CMS configuration did not contain value for path ${path}`);
    case 1:
      return values[0];
    default:
      throw new Error(`CMA configuration did not contain value for path ${path}`)
  }
}

const parseMarkLogicConfig = (filename) => {
  const config = JSON.parse(fs.readFileSync(filename, "utf-8"));
  return {
    databaseNames: {
      schemas: queryOneValue(
        config,
        '$.config[*].database[*]["schema-database"]'
      ),
      triggers: queryOneValue(
        config,
        '$.config[*].database[*]["triggers-database"]'
      ),
      modules: queryOneValue(
        config,
        '$.config[*].server[*]["modules-database"]'
      ),
      content: queryOneValue(
        config,
        '$.config[*].server[*]["content-database"]'
      ),
    },
  };
};

const argv = yargs
  .command(
    "seed <marklogic-configuration-file> <seed-definitions-file>",
    "Seed databases files",
    () => {},
    ({ marklogicConfigurationFile, seedDefinitionsFile }) => {
      const marklogicConfiguration = parseMarkLogicConfig(marklogicConfigurationFile);
      upload.seed({ marklogicConfiguration, seedDefinitionsFile });
    }
  )
  .command(
    "install-view <view-definition-file>",
    "Install TDE view definition",
    () => {},
    (argv) => withDb((db) => views.installView(db, argv))
  )
  .demandCommand().argv;
