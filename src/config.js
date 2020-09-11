
const dotenv = require('dotenv');
const marklogic = require('marklogic');

dotenv.config();

const db = {
    host: process.env.MARKLOGIC_HOST || 'localhost',
    port: process.env.MARKLOGIC_PORT || 8000,
    user: process.env.MARKLOGIC_USER || 'admin',
    password: process.env.MARKLOGIC_PASSWORD || 'admin'
}

if (process.env.MARKLOGIC_DATABASE) {
    db.database = process.env.MARKLOGIC_DATABASE;
}

exports.db = db;

