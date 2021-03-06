import { ChildProcess, exec } from "child_process";
import { uid } from "uid";
import { existsSync } from "fs";
import { resolve } from "path";

import download = require("download");
import os = require("os");
import {
  cur_prebuild,
  cur_prebuild_version,
  exeTuring,
  files,
  nodeActivex,
} from "./prebuild";

const vdir = `v${cur_prebuild_version}`;
const basedir = resolve(os.homedir(), ".com32bit-proxy");
const dirUnpack = resolve(basedir, vdir);

interface FunctionInTuringClinet<T, R, E> {
  (
    context: {
      args: T;
      env: E;
      createDllBridge: (dllPath: string, objectName: string) => any;
    },
  ): R;
}

interface CallbackData<T> {
  type: string;
  result: T;
}
export class TuringProxy<Env = Record<string, any>> {
  public execProcess: ChildProcess;
  public static version: string = cur_prebuild_version;
  constructor(
    exeTuringPath: string = resolve(dirUnpack, exeTuring),
    nodeWinaxPath: string = resolve(dirUnpack, nodeActivex),
  ) {
    this.execProcess = TuringProxy.createTuringClient(
      exeTuringPath,
      nodeWinaxPath,
    );
    this.execProcess.stderr.on('data', json => {
      console.error(json);
    })
  }

  public static createTuringClient(
    exeTuringPath: string,
    nodeWinaxPath: string,
  ): ChildProcess {
    const client = exec(
      `${exeTuringPath}  --winax ${nodeWinaxPath}`,
    );

    return client;
  }

  public static execFunctionInTuringClient<T, R = any, E = Record<string, any>>(
    ep: ChildProcess,
    cb: FunctionInTuringClinet<T, R, E>,
    arg?: T,
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const randomType = `__type__${uid()}`;
      function callback(data: string) {
        const isObjectJson = /^{.+}$/.test(data)
        if (isObjectJson) {
          const { result, type } = JSON.parse(data) as CallbackData<R>;
          if (type === randomType) {
            ep.stdout.removeListener("data", callback);
            resolve(result);
          }
        }else{
          process.stdout.write(data);
          // reject('com32proxy exec error: success callback return un-object JSON string.')
        }
      }
      function errCallback(data: string) {
        const isObjectJson = /^{.+}$/.test(data)
        if (isObjectJson) {
          const { result, type } = JSON.parse(data) as CallbackData<R>;
          if (type === randomType) {
            ep.stderr.removeListener("data", errCallback);
            reject(result);
          }
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

  public exec<ResultType, ArgumentsType = any, EnvType = Env>(
    arg: ArgumentsType,
    cb: FunctionInTuringClinet<ArgumentsType, ResultType, EnvType>,
  ) {
    return TuringProxy.execFunctionInTuringClient<ArgumentsType, ResultType, EnvType>(
      this.execProcess,
      cb,
      arg,
    );
  }

  // ????????????????????????.turing
  public static async downloadPrebuildFiles(
    progressCallback?: (
      _args: {
        filename: string;
        current: number;
        all: number;
        start: boolean;
        end: boolean;
      },
    ) => void,
  ) {
    // ?????????????????????
    let integrity = true;
    for (let i = 0; i < files.length; i++) {
      const exisit = existsSync(resolve(dirUnpack, files[i]));
      if (!exisit) {
        integrity = false;
        break;
      }
    }
    if (!integrity) {
      // ??????????????????,????????????.zip
      if (progressCallback) {
        progressCallback({
          filename: vdir + ".zip",
          current: 0,
          all: 1,
          start: true,
          end: false,
        });
      }
      const url = cur_prebuild.zip;

      await download(url, basedir, { extract: true });
      // ??????zip
      // zipSteam;
      // compressing.zip.UncompressStream();
    }
  }
}
