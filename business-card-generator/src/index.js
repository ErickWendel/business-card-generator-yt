import data from '../resources/data.json'
import { Worker } from 'worker_threads'
import { dirname } from 'path'
const { pathname: currentFile } = new URL(import.meta.url)
const cwd = dirname(currentFile)
const moduleName = `${cwd}/worker.js`

for (const item of [data[0]]) {
    const worker = new Worker(moduleName, { workerData: item })
    worker.on('message', msg => console.log(msg))
    worker.on('error', msg => console.error('error!', msg))
    // worker.postMessage(item)
}

