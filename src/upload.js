
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
  directory,
  database,
  propertyDefinitions,
}) => {
  let db = marklogic.createDatabaseClient({ ...config.db, database });
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
  await db.documents.write(files).result();

  db.release();
};

exports.uploadDirectory = uploadDirectory;
