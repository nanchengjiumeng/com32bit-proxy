const { exec, execFile, fork } = require("child_process");
const { resolve } = require("path");

// const exe = resolve(__dirname, '../prebuild/turing.exe')

// const sub = fork(resolve(__dirname,  '../src/client'))


const sub = exec(`node ${resolve(__dirname, '../prebuild/turing.exe')}`)

sub.stdout.on('data', e=>console.log(e))
sub.stderr.on('data', e=>console.log(e))

sub.stdin.write('asdfsadf')