"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = require("yargs");
exports.args = yargs_1.argv;
_a = require('../../../package.json'), exports.version = _a.version, exports.description = _a.description;
exports.config = require('../../../config.json');
// append / to host if the server op forgot it
if (!exports.config.host.endsWith('/')) {
    exports.config.host += '/';
}
const INSECURE_RANDOM_VALUES = [
    'gfhfdshtrdhgedryhe4t3y5uwjthr',
    'sdlfgihsdor8ghor8dgdrgdegrdg',
    '<some_random_string_here>',
    '<some_other_random_string_here>',
];
if (!DEVELOPMENT && !TESTS &&
    (!exports.config.secret || !exports.config.token
        || exports.config.secret.length < 16
        || exports.config.token.length < 16
        || exports.config.secret === exports.config.token
        || INSECURE_RANDOM_VALUES.includes(exports.config.secret)
        || INSECURE_RANDOM_VALUES.includes(exports.config.token))) {
    console.error(`
================================================================================
                           WARNING! WARNING! WARNING!

Your config parameters token and secret appear to be insecure!
This is **VERY** insecure, as these values serve as authentication tokens for
internal APIs and session cookies. You **must** change these values in order to
prevent potential exploits.

To generate new values for these parameters, you can use the following command:
    node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

Exiting here, as the security of your application cannot be guaranteed...
================================================================================
`);
    process.exit(1);
}
const loginServer = { id: 'login', filter: false, port: exports.config.port };
const adminServer = { id: 'admin', filter: false, port: exports.config.adminPort || exports.config.port };
exports.gameServers = exports.config.servers.filter(s => !s.hidden);
const allServers = [...exports.gameServers, loginServer, adminServer];
allServers.forEach(s => s.flags = s.flags || {});
const serverId = exports.args.game || (exports.args.login ? 'login' : (exports.args.admin ? 'admin' : allServers[0].id));
exports.server = allServers.find(s => s.id === serverId) || allServers[0];
exports.port = (exports.args.port && parseInt(exports.args.port, 10)) || exports.server.port || exports.config.port;
//# sourceMappingURL=config.js.map