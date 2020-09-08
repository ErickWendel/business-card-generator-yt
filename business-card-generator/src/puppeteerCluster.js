const data = require('../resources/data.json')
const { Cluster } = require('puppeteer-cluster')
const querystring = require('querystring')
const { v1 } = require('uuid')
const { join } = require('path')

const BC_URL = 'https://erickwendel.github.io/business-card-template/index.html'


async function render({ page, data: { finalUrl, name } }) {
    
    const output = join(__dirname, `/../output/${name}-${v1()}.pdf`)

    await page.goto(finalUrl, { waitUntil: 'networkidle2', });

    await page.pdf({
        path: output,
        format: 'A4',
        landscape: true,
        printBackground: true,

    });

    console.log('ended', output)
}

function createQueryStringFromObject(data) {
    const separator = null;
    const keyDelimiter = null;
    const options = { encodeURIComponent: querystring.unescape };
    const qs = querystring.stringify(data, separator, keyDelimiter, options);
    return qs;
}

async function main() {

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 10,
    });

    await cluster.task(render);

    for (const item of data) {
        const qs = createQueryStringFromObject(item);
        const finalUrl = `${BC_URL}?${qs}`
        await cluster.queue({ finalUrl, name: item.name });
    }

    await cluster.idle();
    await cluster.close();
}


main()




