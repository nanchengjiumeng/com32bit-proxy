const { program } = require('commander');
const { execSync } = require('child_process');

program
	.option('-d, --dll <path>', 'turing dll path')
	.option('-w, --winax <winax>', 'winax node')
program.parse(process.argv)
const options = program.opts();
const dllPath = options.dll



const winax = require(options.winax || './node_activex.node');

function createDllBridge(dllPath) {
	try {
		return new winax.Object('TURING.FISR');
	} catch (e) {
		execSync(`regsvr32 ${dllPath} /s`);
		return new winax.Object('TURING.FISR');
	}
}

const TURING = createDllBridge(dllPath)

process.stdin.on('data', async (json) => {
	const data = JSON.parse(json)
	const template = `(${data.function})({args:data.arg, TURING, createDllBridge});`;
	try {
		const result = await eval(template)
		process.stdout.write(JSON.stringify({ type: data.type, result }))
	} catch (e) {
		console.log(e)
		process.stderr.write(JSON.stringify({
			type: data.type,
			result: e.toString()
		}))
	}
})