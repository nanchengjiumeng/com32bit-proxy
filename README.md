# com32bit-proxy
32bit node exe combined turing com dll.

## examples

```js
// 获得turing插件的版本
const { TuringProxy } = require("turing-exp");

const tp = new  TuringProxy()

tp.exec(null, (context) => {
	return context.TURING.version()
}).then(version => {
	console.log(version) // 3.0.8.20220210
});
```

## prebuild dir

```js
// 在初始话TuringProxy时, 勿比先调用此静态函数, 下载预编译文件到指定文件夹
TuringProxy.downloadPrebuildFiles()
```

二进制文件将会被下载到`C:\\Users\\{username}\\.turing\\v{version}`, 例如`C:\Users\wang\.turing\v1.0.1`

```js
TuringProxy.version  // v1.0.1
```

下载不到的时, 可根据`version`自行放置

## changelog

### 1.0.2 

1. 变更`exec`的参数 