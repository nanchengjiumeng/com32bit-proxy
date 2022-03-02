"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuringProxy = void 0;
const child_process_1 = require("child_process");
const uid_1 = require("uid");
const { resolve } = require('path');
const exe = resolve(__dirname, '../prebuild/turing.exe');
class TuringProxy {
    constructor(dllTuringPath, exeTuringPath = exe, nodeWinaxPath) {
        this.execProcess = TuringProxy.createTuringClient(dllTuringPath, exeTuringPath, nodeWinaxPath);
    }
    static createTuringClient(dllTuringPath, exeTuringPath = exe, nodeWinaxPath) {
        const client = (0, child_process_1.exec)(`${exeTuringPath} --dll ${dllTuringPath}${nodeWinaxPath ? ` --winax ${nodeWinaxPath}` : ''}`);
        return client;
    }
    static execFunctionInTuringClient(ep, cb, arg) {
        return new Promise((resolve, reject) => {
            const randomType = `__type__${(0, uid_1.uid)()}`;
            function callback(data) {
                const { result, type } = JSON.parse(data);
                if (type === randomType) {
                    ep.stdout.removeListener('data', callback);
                    resolve(result);
                }
            }
            function errCallback(data) {
                const { result, type } = JSON.parse(data);
                if (type === randomType) {
                    ep.stderr.removeListener('data', errCallback);
                    reject(result);
                }
            }
            ep.stdout.addListener('data', callback);
            ep.stderr.addListener('data', errCallback);
            ep.stdin.write(JSON.stringify({
                type: randomType,
                function: cb.toString(),
                arg
            }));
        });
    }
    exec(arg, cb) {
        return TuringProxy.execFunctionInTuringClient(this.execProcess, cb, arg);
    }
}
exports.TuringProxy = TuringProxy;
//# sourceMappingURL=createInstance.js.map