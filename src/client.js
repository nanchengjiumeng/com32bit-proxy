const { program } = require('commander');
const { execSync } = require('child_process');

program
	// .option('-d, --dll <path>', 'turing dll path')
	.option('-w, --winax <winax>', 'winax node')
program.parse(process.argv)

const options = program.opts();
const dllPath = options.dll

const winax = require(options.winax || '../prebuild/node_activex.node');

const env = {} // 全局变量

process.stdin.on('data', async (json) => {
	const isObjectJson = /^{.+}$/.test(json)
	if (!isObjectJson) {
		return process.stderr.write(
			JSON.stringify({
				type: 0,
				result:
					'com32proxy exec error: process.stdin can\'t recive any un-object JSON string.'
			})
		)
	}
	const data = JSON.parse(json)
	if (!data.function) {
		return process.stderr.write(
			JSON.stringify({
				type: 0,
				result:
					'com32proxy exec error: exec\'s callback function not exisits.'
			})
		)
	}

	function createDllBridge(dllPath, comObjectName) {
		try {
			return new winax.Object(comObjectName);
		} catch (e) {
			execSync(`regsvr32 ${dllPath} /s`);
			return new winax.Object(comObjectName);
		}
	}

	const template = `;(${data.function})({args:data.arg, createDllBridge, env});`;


	try {
		const result = await eval(template)
		return process.stdout.write(JSON.stringify({ type: data.type, result }))
	} catch (e) {
		return process.stderr.write(JSON.stringify({
			type: data.type,
			result: e.toString()
		}))
	}

	return process.stderr.write(JSON.stringify({
		type: data.type,
		result: 'com32proxy exec: exec idle running.'
	}))
})