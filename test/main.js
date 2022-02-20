const { createTuringClient, execFunctionInTuringClient, createExecFunctionInTuringClientProxy } = require('../dist/createInstance')
const n = 1080

async function main() {
	const ws = await createTuringClient("D:/turing308/TURING/TURING.dll")
	const proxy = createExecFunctionInTuringClientProxy(ws)
	const hwnds = await proxy({ n }, function ({ n }, TURING) {
		const windows = TURING.Window_Enum("", "大话西游").split('|').map(Number)
		// const child = TURING.Window_EnumChild(windows[1], "", "").split('|').map(Number)
		// TURING.KM_Delay(3000)

		// const hwnd = child[0]
		TURING.Link(windows[1], 'gdi')
		TURING.Window_Lock()
		const size = TURING.Window_GetSize().split(',').map(Number)
		// TURING.Pixel_FromScreen(0, 0, 500, 500)

		// TURING.Pixel_Preview()
		TURING.KM_MoveTo(0, 0)
		// TURING.KM_MoveTo(100, 100)
		TURING.KM_MoveTo(size[0] + 300, size[1] + 300)
		setTimeout(() => {

			TURING.KM_LeftClick()
		}, 1000)
		return
	})
}

main()
