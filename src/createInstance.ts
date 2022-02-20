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



interface FunctionInTuringClinet<T, R = any> {
	(
		args: T,
		TURING?: Turing,
		createDllBridge?: (dllPath: string) => void
	): R
}
interface CallbackData<T> {
	type: string
	result: T
}

export function execFunctionInTuringClient<T, R>(ws: WebSocket, cb: FunctionInTuringClinet<T, R>, arg?: T): Promise<R> {
	return new Promise((resolve) => {
		const randomType = `__type__${uid()}`
		function callback(data: string) {
			const { result, type } = JSON.parse(data) as CallbackData<R>;
			if (type === randomType) {
				ws.removeListener('message', callback)
				resolve(result)
			}
		}
		ws.addListener('message', callback)
		ws.send(JSON.stringify(
			{
				type: randomType,
				function: cb.toString(),
				arg
			}
		))
	})
}

export function createExecFunctionInTuringClientProxy(ws: WebSocket) {
	return <T, R>(arg: T, cb: FunctionInTuringClinet<T, R>) => {
		return execFunctionInTuringClient<T, R>(ws, cb, arg)
	}
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
			const client = exec(`${exePath} --port ${port} --dll ${dllPath}`)
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

