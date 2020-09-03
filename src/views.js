const fs = require('fs');
const path = require('path');

const installView = async (db, { viewDefinitionFile }) => {
    const viewDefinition = fs.readFileSync(viewDefinitionFile, 'UTF-8');
    const uri = `/templates/${path.basename(viewDefinitionFile)}`;

    const query = `
xquery version "1.0-ml";

import module namespace tde = "http://marklogic.com/xdmp/tde" 
        at "/MarkLogic/tde.xqy";

declare variable $uri external;
declare variable $viewDefinition external;

tde:template-insert($uri, xdmp:unquote($viewDefinition))
`;

    await db.xqueryEval(query, { uri, viewDefinition }).result();
}

exports.installView = installView;
