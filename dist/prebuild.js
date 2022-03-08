"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cur_prebuild = exports.versions = exports.cur_prebuild_version = exports.files = exports.nodeActivex = exports.exeTuring = void 0;
exports.exeTuring = "turing.exe";
exports.nodeActivex = "node_activex.node";
exports.files = [exports.nodeActivex, exports.exeTuring];
exports.cur_prebuild_version = "1.0.2";
exports.versions = [
    {
        version: exports.cur_prebuild_version,
        zip: `https://github.com/nanchengjiumeng/com32bit-proxy/releases/download/v${exports.cur_prebuild_version}/v${exports.cur_prebuild_version}.zip`,
    },
];
exports.cur_prebuild = exports.versions.find((v) => v.version === exports.cur_prebuild_version);
//# sourceMappingURL=prebuild.js.map