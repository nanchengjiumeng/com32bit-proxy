const path = require('path')
import { TuringProxy } from '../src/createInstance'

const dlpath = "D:/turing308/TURING/TURING.dll"
const turingProxy = new TuringProxy(
	path.resolve(__dirname, "../prebuild/turing.exe"),
	path.resolve(__dirname, "../prebuild/node_activex.node")
)

turingProxy.exec({ dlpath, name: 'TURING.FISR' }, (context) => {
	context.env.TURING = context.createDllBridge(context.args.dlpath, context.args.name)
}).then(async () => {
	const prefix: string = 'version'
	return `${prefix}: ${await turingProxy.exec(null, (context) => context.env.TURING.Version())}`
}).then(version => {
	console.log(version)
})