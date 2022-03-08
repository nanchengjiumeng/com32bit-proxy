const path = require('path')
const { TuringProxy } = require('../dist/createInstance')
const n = 1080

const dlpath = "D:/turing308/TURING/TURING.dll"
const turingProxy = new TuringProxy(
	path.resolve(__dirname, "../prebuild/turing.exe"),
	path.resolve(__dirname,  "../prebuild/node_activex.node")
	)


turingProxy.exec({dlpath, name: 'TURING.FISR'}, (context) => {
	context.env.TURING = context.createDllBridge(context.args.dlpath, context.args.name)
}).then(()=>{
	return turingProxy.exec(null, (context)=>context.env.TURING.Version())
}).then(version => {
	console.log(version)
})

// const ws = await createTuringClient("D:/turing308/TURING/TURING.dll")
// const proxy = createExecFunctionInTuringClientProxy(ws)
// const hwnds = await proxy({ n }, function ({ n }, TURING) {
	// const windows = TURING.Window_Enum("", "Counter").split('|').map(Number)
	// console.log(windows[0])
	// const child = TURING.Window_EnumChild(windows[1], "", "").split('|').map(Number)
	// TURING.KM_Delay(3000)

	// // const hwnd = child[0]
	// TURING.Link(windows[1], 'km')
	// setTimeout(() => {

	// }, (t));
	// TURING.Window_Lock()
	// const size = TURING.Window_GetSize().split(',').map(Number)
	// // TURING.Pixel_FromScreen(0, 0, 500, 500)

	// // TURING.Pixel_Preview()
	// TURING.KM_MoveTo(0, 0)
	// // TURING.KM_MoveTo(100, 100)
	// TURING.KM_MoveTo(size[0] + 300, size[1] + 300)
	// setTimeout(() => {

	// 	TURING.KM_LeftClick()
	// }, 1000)
// 	setInterval(() => {

// 		const coursor = TURING.KM_GetCursorPos().split(',').map(Number)
// 		// console.log(coursor)
// 		TURING.KM_MoveTo(-1, 0)

// 	}, 300)
// 	return
// })
