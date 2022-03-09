const { program } = require('commander');
const { execSync } = require('child_process');

program
	// .option('-d, --dll <path>', 'turing dll path')
	.option('-w, --winax <winax>', 'winax node')
program.parse(process.argv)

const options = program.opts();
const dllPath = options.dll

const winax = require(options.winax || '../prebuild/node_activex.node');

function createDllBridge(dllPath, comObjectName) {
	try {
		return new winax.Object(comObjectName);
	} catch (e) {
		execSync(`regsvr32 ${dllPath} /s`);
		return new winax.Object(comObjectName);
	}
}


const env = {
	
}

process.stdin.on('data', async (json) => {
	try {
		const data = JSON.parse(json)
		const template = `(${data.function})({args:data.arg, createDllBridge, env});`;
		const result = await eval(template)
		process.stdout.write(JSON.stringify({ type: data.type, result }))
	} catch (e) {
		process.stderr.write(JSON.stringify({
			type: data.type,
			result: e.toString()
		}))
	}
})