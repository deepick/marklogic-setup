const fs = require('fs');
const path = require('path');

const installView = async (db, { viewDefinitionFile }) => {
    const viewDefinition = fs.readFileSync(viewDefinitionFile, 'UTF-8');
    const basename = path.basename(viewDefinitionFile);

    const query = `
xquery version "1.0-ml";

import module namespace tde = "http://marklogic.com/xdmp/tde" 
        at "/MarkLogic/tde.xqy";

let $template := ${viewDefinition}

return tde:template-insert('/templates/${basename}', $template)
`;

    await db.xqueryEval(query).result();
}

exports.installView = installView;
