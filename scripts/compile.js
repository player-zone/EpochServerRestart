const { exec } = require('pkg');

async function build() {
    console.log('Compiling...');

    await exec(['index.js', '--target', 'win32', '--output', './dist/EpochServerRestart.exe']);

    console.log('Build complete.');
} 

build();