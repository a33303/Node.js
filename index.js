const fs = require('fs')
const readline = require("readline");

const readStream = fs.createReadStream('./access.log', 'utf8')
const writeStreamOne =  fs.createWriteStream('./89.123.1.41_requests.log')
const writeStreamTwo =  fs.createWriteStream('./34.48.240.111_requests.log')

const rl = readline.createInterface({
    input: readStream,
    terminal: true
});

rl.on('line', (line) => {
    if (line.includes('89.123.1.41')) {
        writeStreamOne.write(line + "\n")
    }

    if (line.includes('34.48.240.111')) {
        writeStreamTwo.write(line + "\n")
    }
})