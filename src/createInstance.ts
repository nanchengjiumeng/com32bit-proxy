import { ChildProcess, exec } from "child_process";
import { uid } from "uid";
import { existsSync } from "fs";
import { resolve } from "path";
import { Turing } from "../types/turing";

import download = require("download");
import os = require("os");
import {
  cur_prebuild,
  cur_prebuild_version,
  dllTuring,
  exeTuring,
  files,
  nodeActivex,
} from "./prebuild";

const vdir = `v${cur_prebuild_version}`;
const basedir = resolve(os.homedir(), ".turing");
const dirUnpack = resolve(basedir, vdir);

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
  public static version: string = cur_prebuild_version;
  constructor(
    dllTuringPath: string = resolve(dirUnpack, dllTuring),
    exeTuringPath: string = resolve(dirUnpack, exeTuring),
    nodeWinaxPath: string = resolve(dirUnpack, nodeActivex),
  ) {
    this.execProcess = TuringProxy.createTuringClient(
      dllTuringPath,
      exeTuringPath,
      nodeWinaxPath,
    );
  }

  public static createTuringClient(
    dllTuringPath: string,
    exeTuringPath: string,
    nodeWinaxPath: string,
  ): ChildProcess {
    const client = exec(
      `${exeTuringPath} --dll ${dllTuringPath} --winax ${nodeWinaxPath}`,
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

  // 下载预编译文件到.turing
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
    // 检验文件完整性
    let integrity = true;
    for (let i = 0; i < files.length; i++) {
      const exisit = existsSync(resolve(dirUnpack, files[i]));
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
      const url = cur_prebuild.zip;

      await download(url, basedir, { extract: true });
      // 解压zip
      // zipSteam;
      // compressing.zip.UncompressStream();
    }
  }
}
