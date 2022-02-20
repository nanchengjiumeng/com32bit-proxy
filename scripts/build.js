var compile = require('nexe').compile;
var path = require('path');
var cwd = path.resolve(__dirname);
var releaseDir = path.resolve('./prebuild/');

compile({
	input: '../src/client.js',
	output: path.resolve(releaseDir, 'turing'),
	cwd: cwd
});