import WebSocket = require('ws')
import { getPortPromise } from 'portfinder'
import { exec } from 'child_process'
import { uid } from 'uid';
import { Turing } from '../types/turing'
const { resolve } = require('path');

const exe = resolve(__dirname, '../prebuild/turing.exe')


let connected = false

let ws: WebSocket = null
let wss: WebSocket.WebSocketServer = null



interface FunctionInTuringClinet<T = any> {
	(
		TURING?: Turing,
		createDllBridge?: (dllPath: string) => void
	): T
}
interface CallbackData<T> {
	type: string
	result: T
}
export function execFunctionInTuringClient<T>(ws: WebSocket, cb: FunctionInTuringClinet<T>): Promise<T> {
	return new Promise((resolve) => {
		const randomType = `__type__${uid()}`
		function callback(data: string) {
			const { result, type } = JSON.parse(data) as CallbackData<T>;
			if (type === randomType) {
				ws.removeListener('message', callback)
				resolve(result)
			}
		}
		ws.addListener('message', callback)
		ws.send(JSON.stringify(
			{
				type: randomType,
				function: cb.toString()
			}
		))
	})
}

export function createTuringClient(dllPath: string, exePath: string = exe): Promise<WebSocket> {
	return new Promise(async resolve => {
		if (!connected) {
			const port = await getPortPromise()
			wss = new WebSocket.WebSocketServer({ port });
			wss.on('connection', function connection(ws) {
				wss = wss
				ws = ws
				connected = true
				resolve(ws)
			});
			const client = exec(`${exe} --port ${port} --dll ${dllPath}`)
			client.stdout.on('data', chun => {
				console.log(chun.toString())
			})
			client.stderr.on('data', chun => {
				console.log(chun.toString())
			})
		} else {
			resolve(ws)
		}
	})
}

