const data = require('../resources/data.json')
const cp = require('child_process')
const cwd = __dirname
const moduleName = `${cwd}/worker.js`

for (const item of data) {
    console.log('data', item.name)
    const worker = cp.fork(moduleName, [])
    
    worker.on('message', msg => console.log(msg))
    worker.on('error', msg => console.error('error!', msg))
 
    worker.send(item);
}

