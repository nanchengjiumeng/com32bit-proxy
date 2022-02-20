import WebSocket = require('ws');
import { Turing } from '../types/turing';
interface FunctionInTuringClinet<T = any> {
    (TURING?: Turing, createDllBridge?: (dllPath: string) => void): T;
}
export declare function execFunctionInTuringClient<T>(ws: WebSocket, cb: FunctionInTuringClinet<T>): Promise<T>;
export declare function createTuringClient(dllPath: string, exePath?: string): Promise<WebSocket>;
export {};
