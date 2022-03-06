var compile = require('nexe').compile;
var path = require('path');
var fs = require('fs-extra')
var cwd = path.resolve(__dirname);
var releaseDir = path.resolve('./prebuild/');
var compressing = require('compressing')
var pkg = require('../package.json')


const native_modules = [
	["winax/build/Release/", "node_activex.node"]
]


function copyNativeModules() {
	native_modules.forEach(function ([dir, name]) {
		var module_direction_name = dir + name
		var src = path.resolve(cwd, "../node_modules/".concat(module_direction_name));
		// var dest = module_direction_name.includes('winax') ?
		var dest = path.resolve(releaseDir, name);
		// : path.resolve(releaseDir, "node_modules/".concat(module_direction_name));
		if (!fs.existsSync(dest)) {
			console.log('copy native node file:', module_direction_name);
			fs.copySync(src, dest, { overwrite: true });
		}
	})
}


function build() {
	return Promise.resolve()
		.then(() => {
			copyNativeModules()
			return compile({
				input: '../src/client.js',
				output: path.resolve(releaseDir, 'turing'),
				cwd: cwd
			})
		})
		.then(() => {
			const dirRelease = path.resolve(__dirname, '../release')
			const existsDirRelease = fs.pathExistsSync(dirRelease)
			if (!existsDirRelease) {
				fs.mkdirSync(dirRelease)
			}
			const filename = `v${pkg.version}.zip`
			console.log(`generating ${filename}`)
			return compressing.zip.compressDir(
				path.resolve(__dirname, '../prebuild/'),
				path.resolve(dirRelease, filename),
				{
					ignoreBase: true
				}
			)
		}).then(() => {
			console.log(`build sucess`)
		})
}

build()