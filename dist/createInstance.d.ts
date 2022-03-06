/// <reference types="node" />
import { ChildProcess } from "child_process";
import { Turing } from "../types/turing";
interface FunctionInTuringClinet<T, R = any> {
    (context: {
        args: T;
        TURING: Turing;
        createDllBridge: (dllPath: string) => void;
    }): R;
}
export declare class TuringProxy {
    execProcess: ChildProcess;
    static version: string;
    constructor(dllTuringPath?: string, exeTuringPath?: string, nodeWinaxPath?: string);
    static createTuringClient(dllTuringPath: string, exeTuringPath: string, nodeWinaxPath: string): ChildProcess;
    static execFunctionInTuringClient<T, R>(ep: ChildProcess, cb: FunctionInTuringClinet<T, R>, arg?: T): Promise<R>;
    exec<ResultType, ArgumentsType = void>(arg: ArgumentsType, cb: FunctionInTuringClinet<ArgumentsType, ResultType>): Promise<ResultType>;
    static downloadPrebuildFiles(progressCallback?: (_args: {
        filename: string;
        current: number;
        all: number;
        start: boolean;
        end: boolean;
    }) => void): Promise<void>;
}
export {};
