export const exeTuring = "turing.exe";
export const dllTuring = "TURING.dll";
export const nodeActivex = "node_activex.node";
export const files = [nodeActivex, dllTuring, exeTuring];
export const cur_prebuild_version = "1.0.1";
export const versions = [
  {
    version: "1.0.1",
    zip:
      // "https://github.com/nanchengjiumeng/com32bit-proxy/releases/download/v1.0.0/v1.0.1.zip",
      "https://test-ebook1.oss-cn-beijing.aliyuncs.com/test-fe/v1.0.1.zip",
  },
];
export const cur_prebuild = versions.find((v) =>
  v.version === cur_prebuild_version
);
