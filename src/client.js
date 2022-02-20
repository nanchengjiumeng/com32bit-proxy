const winax = require('winax')
const { program } = require('commander');
const { WebSocket } = require('ws');

program
	.option('-p, --port <port>', 'listen port')
	.option('-d, --dll <path>', 'turing dll path')
program.parse(process.argv)
const options = program.opts();
const port = Number(options.port)
const dllPath = options.dll

function createDllBridge(dllPath) {
	try {
		return new winax.Object('TURING.FISR');
	} catch (e) {
		execSync(`regsvr32 ${dllPath} /s`);
		return new winax.Object('TURING.FISR');
	}
}

const TURING = createDllBridge(dllPath)

const ws = new WebSocket(`ws://localhost:${port}`);

ws.on('message', async function message(json) {
	const data = JSON.parse(json)
	const template = `(${data.function})(TURING, createDllBridge);`;
	const type = data.type
	const result = await eval(template)
	ws.send(JSON.stringify({ type, result }))
});

