"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuringProxy = void 0;
const child_process_1 = require("child_process");
const uid_1 = require("uid");
const fs_1 = require("fs");
const path_1 = require("path");
const download = require("download");
const os = require("os");
const prebuild_1 = require("./prebuild");
const vdir = `v${prebuild_1.cur_prebuild_version}`;
const basedir = (0, path_1.resolve)(os.homedir(), ".turing");
const dirUnpack = (0, path_1.resolve)(basedir, vdir);
class TuringProxy {
    constructor(exeTuringPath = (0, path_1.resolve)(dirUnpack, prebuild_1.exeTuring), nodeWinaxPath = (0, path_1.resolve)(dirUnpack, prebuild_1.nodeActivex)) {
        this.execProcess = TuringProxy.createTuringClient(exeTuringPath, nodeWinaxPath);
    }
    static createTuringClient(exeTuringPath, nodeWinaxPath) {
        const client = (0, child_process_1.exec)(`${exeTuringPath}  --winax ${nodeWinaxPath}`);
        return client;
    }
    static execFunctionInTuringClient(ep, cb, arg) {
        return new Promise((resolve, reject) => {
            const randomType = `__type__${(0, uid_1.uid)()}`;
            function callback(data) {
                const { result, type } = JSON.parse(data);
                if (type === randomType) {
                    ep.stdout.removeListener("data", callback);
                    resolve(result);
                }
            }
            function errCallback(data) {
                const { result, type } = JSON.parse(data);
                if (type === randomType) {
                    ep.stderr.removeListener("data", errCallback);
                    reject(result);
                }
            }
            ep.stdout.addListener("data", callback);
            ep.stderr.addListener("data", errCallback);
            ep.stdin.write(JSON.stringify({
                type: randomType,
                function: cb.toString(),
                arg,
            }));
        });
    }
    exec(arg, cb) {
        return TuringProxy.execFunctionInTuringClient(this.execProcess, cb, arg);
    }
    // 下载预编译文件到.turing
    static downloadPrebuildFiles(progressCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            // 检验文件完整性
            let integrity = true;
            for (let i = 0; i < prebuild_1.files.length; i++) {
                const exisit = (0, fs_1.existsSync)((0, path_1.resolve)(dirUnpack, prebuild_1.files[i]));
                if (!exisit) {
                    integrity = false;
                    break;
                }
            }
            if (!integrity) {
                // 如果缺少文件,下载最新.zip
                if (progressCallback) {
                    progressCallback({
                        filename: vdir + ".zip",
                        current: 0,
                        all: 1,
                        start: true,
                        end: false,
                    });
                }
                const url = prebuild_1.cur_prebuild.zip;
                yield download(url, basedir, { extract: true });
                // 解压zip
                // zipSteam;
                // compressing.zip.UncompressStream();
            }
        });
    }
}
exports.TuringProxy = TuringProxy;
TuringProxy.version = prebuild_1.cur_prebuild_version;
//# sourceMappingURL=createInstance.js.map