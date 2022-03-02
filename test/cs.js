const { TuringProxy } = require('../dist/createInstance')
const n = 1080

const turingProxy = new TuringProxy("D:/turing308/TURING/TURING.dll")


turingProxy.exec(null, (arg, Turing) => {
	return Turing.abc()
}).then(version => {
	console.log(version)
}).catch(e => {
	console.log(e)
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
