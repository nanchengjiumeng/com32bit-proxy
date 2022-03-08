export const exeTuring = "turing.exe";
export const nodeActivex = "node_activex.node";
export const files = [nodeActivex, exeTuring];
export const cur_prebuild_version = "1.0.2";
export const versions = [
  {
    version: cur_prebuild_version,
    zip:
      `https://github.com/nanchengjiumeng/com32bit-proxy/releases/download/v${cur_prebuild_version}/v${cur_prebuild_version}.zip`,
  },
];
export const cur_prebuild = versions.find((v) =>
  v.version === cur_prebuild_version
);
