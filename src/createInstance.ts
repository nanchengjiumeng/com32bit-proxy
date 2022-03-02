import { ChildProcess, exec } from "child_process";
import { uid } from "uid";
import { Turing } from "../types/turing";
const { resolve } = require("path");

const exe = resolve(__dirname, "../prebuild/turing.exe");

interface FunctionInTuringClinet<T, R = any> {
  (
    args: T,
    TURING?: Turing,
    createDllBridge?: (dllPath: string) => void,
  ): R;
}
interface CallbackData<T> {
  type: string;
  result: T;
}
export class TuringProxy {
  public execProcess: ChildProcess;
  constructor(
    dllTuringPath: string,
    exeTuringPath: string = exe,
    nodeWinaxPath?: string,
  ) {
    this.execProcess = TuringProxy.createTuringClient(
      dllTuringPath,
      exeTuringPath,
      nodeWinaxPath,
    );
  }

  public static createTuringClient(
    dllTuringPath: string,
    exeTuringPath: string = exe,
    nodeWinaxPath?: string,
  ): ChildProcess {
    const client = exec(
      `${exeTuringPath} --dll ${dllTuringPath}${
        nodeWinaxPath ? ` --winax ${nodeWinaxPath}` : ""
      }`,
    );

    return client;
  }

  public static execFunctionInTuringClient<T, R>(
    ep: ChildProcess,
    cb: FunctionInTuringClinet<T, R>,
    arg?: T,
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const randomType = `__type__${uid()}`;
      function callback(data: string) {
        const { result, type } = JSON.parse(data) as CallbackData<R>;
        if (type === randomType) {
          ep.stdout.removeListener("data", callback);
          resolve(result);
        }
      }
      function errCallback(data: string) {
        const { result, type } = JSON.parse(data) as CallbackData<R>;
        if (type === randomType) {
          ep.stderr.removeListener("data", errCallback);
          reject(result);
        }
      }
      ep.stdout.addListener("data", callback);
      ep.stderr.addListener("data", errCallback);
      ep.stdin.write(JSON.stringify(
        {
          type: randomType,
          function: cb.toString(),
          arg,
        },
      ));
    });
  }

  public exec<ResultType, ArgumentsType = void>(
    arg: ArgumentsType,
    cb: FunctionInTuringClinet<ArgumentsType, ResultType>,
  ) {
    return TuringProxy.execFunctionInTuringClient<ArgumentsType, ResultType>(
      this.execProcess,
      cb,
      arg,
    );
  }
}
