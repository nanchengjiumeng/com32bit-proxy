# com32bit-proxy
32bit node exe combined turing com dll.

## examples

```js
// 获得turing插件的版本
const { TuringProxy } = require("com32bit-proxy");

const tp = new TuringProxy()

const dlpath = "D:/turing308/TURING/TURING.dll"
const cn = 'TURING.FISR'

tp.exec({dlpath, name: cn}, (context) => {
	context.env.TURING = context.createDllBridge(context.args.dlpath, context.args.name)
}).then(()=>{
	return tp.exec(null, (context)=>context.env.TURING.Version())
}).then(version => {
	console.log(version)	// 3.0.8.20220210
})
```

## prebuild dir

```js
// 调用此静态函数, 下载预编译文件到指定文件夹
TuringProxy.downloadPrebuildFiles()
```

二进制文件将会被下载到`C:\\Users\\{username}\\.com32bit-proxy\\v{version}`
例如`C:\Users\wang\.com32bit-proxy\v1.0.1`

```js
TuringProxy.version  // v1.0.1
```

下载不到的时, 可根据`version`自行放置

## changelog

### 1.0.2 

1. 变更`exec`的参数 