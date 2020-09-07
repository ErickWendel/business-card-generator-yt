const data = require('../resources/data.json')
const cp = require('child_process')
const moduleName = `${__dirname}/worker.js`

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function handleConcurrency(counter) {
    counter++
    if (counter > 10) {
        console.log('waiting...')
        await sleep(10000)
        counter = 0
    }
    return counter
}

;
(async function main() {
    let counter = 0;

    for (const item of data) {
        counter = await handleConcurrency(counter)

        console.log('data', item.name)
        const worker = cp.fork(moduleName, [])

        worker.on('message', msg => console.log(msg))
        worker.on('error', msg => console.error('error!', msg))

        worker.send(item);
    }

})();


