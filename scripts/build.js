var compile = require('nexe').compile;
var path = require('path');
var fs = require('fs-extra')
var cwd = path.resolve(__dirname);
var releaseDir = path.resolve('./prebuild/');

const native_modules = [
	["winax/build/Release/", "node_activex.node"]
]


function copyNativeModules() {
	native_modules.forEach(function ([dir, name]) {
		var module_direction_name = dir + name
		var src = path.resolve(cwd, "../node_modules/".concat(module_direction_name));
		var dest = module_direction_name.includes('winax') ?
			path.resolve(releaseDir, "../src/", name)
			: path.resolve(releaseDir, "node_modules/".concat(module_direction_name));
		if (!fs.existsSync(dest)) {
			console.log('copy native node file:', module_direction_name);
			fs.copySync(src, dest, { overwrite: true });
		}
	})
}


copyNativeModules()

compile({
	input: '../src/client.js',
	output: path.resolve(releaseDir, 'turing'),
	cwd: cwd
})
