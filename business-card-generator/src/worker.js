import { parentPort, threadId, workerData } from 'worker_threads'
// import Nightmare from 'nightmare';
import querystring from 'querystring'
import { v1 } from 'uuid'
import { dirname } from 'path'
import puppeteer from 'puppeteer';

const { pathname: currentFile } = new URL(import.meta.url)
const cwd = dirname(currentFile)

const BC_URL = 'https://erickwendel.github.io/business-card-template/index.html'


// const nightmare = Nightmare({
//     // show: true
// });

async function render({ finalUrl, name }) {
    const WIDTH = 1920;
    const HEIGHT = 1080;
    const output = `${cwd}/../output/${name}-${v1()}.pdf`

    const browser = await puppeteer.launch({
        // headless: false,
        defaultViewport: {
            height: HEIGHT,
            width: WIDTH
        }
    });
    const page = await browser.newPage();
    await page.goto(finalUrl, { waitUntil: 'networkidle2', });

    await page.pdf({
        path: output,
        format: 'A4',
        landscape: true,
        printBackground: true,

    });

    await browser.close();
}

function createQueryStringFromObject(data) {
    const separator = null;
    const keyDelimiter = null;
    const options = { encodeURIComponent: querystring.unescape };
    const qs = querystring.stringify(data, separator, keyDelimiter, options);
    return qs;
}

async function main(data) {
    console.log(`${threadId} got message: ${data.name}`);
    const qs = createQueryStringFromObject(data);
    const finalUrl = `${BC_URL}?${qs}`

    try {
        await render({ finalUrl, name: data.name })
        parentPort.postMessage(`${threadId} has finished`)
    } catch (error) {
        parentPort.postMessage(`${threadId} has crashed: ${error.stack}`)
    }

}


// parentPort.once('message', main);
main(workerData)



