import WebSocket = require('ws');
import { Turing } from '../types/turing';
interface FunctionInTuringClinet<T, R = any> {
    (args: T, TURING?: Turing, createDllBridge?: (dllPath: string) => void): R;
}
export declare function execFunctionInTuringClient<T, R>(ws: WebSocket, cb: FunctionInTuringClinet<T, R>, arg?: T): Promise<R>;
export declare function createExecFunctionInTuringClientProxy(ws: WebSocket): <T, R>(arg: T, cb: FunctionInTuringClinet<T, R>) => Promise<R>;
export declare function createTuringClient(dllPath: string, exePath?: string): Promise<WebSocket>;
export {};
