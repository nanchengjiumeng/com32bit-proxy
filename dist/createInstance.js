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
exports.createTuringClient = exports.execFunctionInTuringClient = void 0;
const WebSocket = require("ws");
const portfinder_1 = require("portfinder");
const child_process_1 = require("child_process");
const uid_1 = require("uid");
const { resolve } = require('path');
const exe = resolve(__dirname, '../prebuild/turing.exe');
let connected = false;
let ws = null;
let wss = null;
function execFunctionInTuringClient(ws, cb) {
    return new Promise((resolve) => {
        const randomType = `__type__${(0, uid_1.uid)()}`;
        function callback(data) {
            const { result, type } = JSON.parse(data);
            if (type === randomType) {
                ws.removeListener('message', callback);
                resolve(result);
            }
        }
        ws.addListener('message', callback);
        ws.send(JSON.stringify({
            type: randomType,
            function: cb.toString()
        }));
    });
}
exports.execFunctionInTuringClient = execFunctionInTuringClient;
function createTuringClient(dllPath, exePath = exe) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        if (!connected) {
            const port = yield (0, portfinder_1.getPortPromise)();
            wss = new WebSocket.WebSocketServer({ port });
            wss.on('connection', function connection(ws) {
                wss = wss;
                ws = ws;
                connected = true;
                resolve(ws);
            });
            const client = (0, child_process_1.exec)(`${exe} --port ${port} --dll ${dllPath}`);
            client.stdout.on('data', chun => {
                console.log(chun.toString());
            });
            client.stderr.on('data', chun => {
                console.log(chun.toString());
            });
        }
        else {
            resolve(ws);
        }
    }));
}
exports.createTuringClient = createTuringClient;
//# sourceMappingURL=createInstance.js.map