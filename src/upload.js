
const fs = require('fs');
const path = require('path');
const marklogic = require('marklogic');
const glob = require('glob');

const config = require('./config');

const getPropertiesForPath = (propertyDefinitions, path) => {
  let documentProperties = {};
  for (const [regexp, properties] of Object.entries(propertyDefinitions).sort(
    // Sort so that shorter regular expressions are evaluated before longer ones
    ([a], [b]) => a.length - b.length
  )) {
    const matcher = new RegExp(regexp);
    if (path.match(matcher)) {
      Object.assign(documentProperties, properties);
    }
  }
  return documentProperties;
};

exports.getPropertiesForPath = getPropertiesForPath;

const uploadDirectory = async ({
  db,
  directory,
  database,
  propertyDefinitions,
}) => {
  const directoryWithoutSlash = directory.replace(/\/*$/, "");
  const files = glob
    .sync(`${directoryWithoutSlash}/**/*`, { nodir: true })
    .map((path) => {
      const properties = getPropertiesForPath(propertyDefinitions, path);
      return {
        uri: path.substring(directoryWithoutSlash.length),
        content: fs.readFileSync(path),
        ...properties,
      };
    });
  if (files.length) {
    console.log('Uploading', files.length, 'files to database', database);
    await db.documents.write(files).result();
  }
};

exports.uploadDirectory = uploadDirectory;

const seed = async ({ marklogicConfiguration, seedDefinitionsFile }) => {
  const seedDefinitions = JSON.parse(
    fs.readFileSync(seedDefinitionsFile, "UTF-8")
  );
  for (const [directory, propertyDefinitions] of Object.entries(seedDefinitions)) {
    const database = marklogicConfiguration.databaseNames[directory];
    let db = marklogic.createDatabaseClient({ ...config.db, database });
    await uploadDirectory({ db, directory, database, propertyDefinitions });
    db.release();
  }
};

 exports.seed = seed;