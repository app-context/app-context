import { spawn } from 'child_process';

function installNpmModules(modules = [], dir = process.cwd()) {
  return new Promise((resolve, reject) => {
    if (modules.length === 0) { return resolve(); }

    const proc = spawn('sh', [
      '-c',
      `npm install --save --save-exact ${modules.join(' ')}`
    ], { cwd: dir, stdio: 'inherit' });

    proc.on('close', (code) => {
      if (code !== 0) { return reject(new Error(`${command} exited with code ${code}`)); }
      resolve();
    });
  });
}

export {
  installNpmModules
};
