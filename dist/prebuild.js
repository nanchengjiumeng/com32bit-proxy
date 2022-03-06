"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cur_prebuild = exports.versions = exports.cur_prebuild_version = exports.files = exports.nodeActivex = exports.dllTuring = exports.exeTuring = void 0;
exports.exeTuring = "turing.exe";
exports.dllTuring = "TURING.dll";
exports.nodeActivex = "node_activex.node";
exports.files = [exports.nodeActivex, exports.dllTuring, exports.exeTuring];
exports.cur_prebuild_version = "1.0.2";
exports.versions = [
    {
        version: exports.cur_prebuild_version,
        zip: "https://github.com/nanchengjiumeng/com32bit-proxy/releases/download/v1.0.1/v1.0.1.zip",
        // "https://test-ebook1.oss-cn-beijing.aliyuncs.com/test-fe/v1.0.1.zip",
    },
];
exports.cur_prebuild = exports.versions.find((v) => v.version === exports.cur_prebuild_version);
//# sourceMappingURL=prebuild.js.map