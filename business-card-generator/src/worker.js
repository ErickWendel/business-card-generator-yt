const querystring = require('querystring')
const { v1 } = require('uuid')
const { join } = require('path')
const puppeteer = require('puppeteer')

const cwd = __dirname

const BC_URL = 'https://erickwendel.github.io/business-card-template/index.html'


async function render({ finalUrl, name }) {
    const WIDTH = 1920;
    const HEIGHT = 1080;
    const output = join(cwd, `/../output/${name}-${v1()}.pdf`)

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
    const threadId = process.pid
    console.log(`${threadId} got message: ${data.name}`);
    const qs = createQueryStringFromObject(data);
    const finalUrl = `${BC_URL}?${qs}`

    try {
        await render({ finalUrl, name: data.name })
        process.send(`${threadId} has finished`)
    } catch (error) {
        process.send(`${threadId} has crashed: ${error.stack}`)
    }

}

process.once('message', main)




