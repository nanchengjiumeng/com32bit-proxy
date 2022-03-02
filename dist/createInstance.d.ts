/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { Turing } from '../types/turing';
interface FunctionInTuringClinet<T, R = any> {
    (args: T, TURING?: Turing, createDllBridge?: (dllPath: string) => void): R;
}
export declare class TuringProxy {
    execProcess: ChildProcess;
    constructor(dllTuringPath: string, exeTuringPath?: string, nodeWinaxPath?: string);
    static createTuringClient(dllTuringPath: string, exeTuringPath?: string, nodeWinaxPath?: string): ChildProcess;
    static execFunctionInTuringClient<T, R>(ep: ChildProcess, cb: FunctionInTuringClinet<T, R>, arg?: T): Promise<R>;
    exec<ResultType, ArgumentsType = void>(arg: ArgumentsType, cb: FunctionInTuringClinet<ArgumentsType, ResultType>): Promise<ResultType>;
}
export {};
