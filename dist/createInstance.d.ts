/// <reference types="node" />
import { ChildProcess } from "child_process";
interface FunctionInTuringClinet<T, R, E> {
    (context: {
        args: T;
        env: E;
        createDllBridge: (dllPath: string, objectName: string) => any;
    }): R;
}
export declare class TuringProxy<Env = Record<string, any>> {
    execProcess: ChildProcess;
    static version: string;
    constructor(exeTuringPath?: string, nodeWinaxPath?: string);
    static createTuringClient(exeTuringPath: string, nodeWinaxPath: string): ChildProcess;
    static execFunctionInTuringClient<T, R = any, E = Record<string, any>>(ep: ChildProcess, cb: FunctionInTuringClinet<T, R, E>, arg?: T): Promise<R>;
    exec<ResultType, ArgumentsType = any, EnvType = Env>(arg: ArgumentsType, cb: FunctionInTuringClinet<ArgumentsType, ResultType, EnvType>): Promise<ResultType>;
    static downloadPrebuildFiles(progressCallback?: (_args: {
        filename: string;
        current: number;
        all: number;
        start: boolean;
        end: boolean;
    }) => void): Promise<void>;
}
export {};
