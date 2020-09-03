
const dotenv = require('dotenv');
const marklogic = require('marklogic');

dotenv.config();

exports.db = {
    host: process.env.MARKLOGIC_HOST || 'localhost',
    port: process.env.MARKLOGIC_PORT || 8000,
    user: process.env.MARKLOGIC_USER || 'admin',
    password: process.env.MARKLOGIC_PASSWORD || 'admin',
    // FIXME: hard-coded database name
    database: process.env.MARKLOGIC_DATABASE || 'kerndaten'
};

