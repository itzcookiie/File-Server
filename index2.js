const http = require("http")
const fs = require("fs")
const readline = require('readline')
const es = require('event-stream')
const s = require('stream')

var endOfLine = require('os').EOL;
var g = []

const server = http.createServer((req,res) => {

    if(req.method === 'GET') {
        fs.readdir('./', (err, files) => {
            res.writeHead(200, {'Content-Type': 'text/html'})
            for(file of files) {
                res.write(file + '<br>');
            }
            res.end()
        })
    }

    if (req.method == "POST") {
        let chunks
        req.on("data", chunk => {
            chunks+=chunk
        })
        req.on("end", _ => {
            res.end()
            writeToFile(chunks)
        })

    }
}).listen(8000, () => console.log("listening 8000"))

function writeToFile(data) {
    console.time('Read')
    console.time('Write')
    fs.writeFile('helo.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.timeEnd('Write')
        let lines = 0
        const size = fs.statSync('./helo.json').size

        const stream = fs.createReadStream('helo.json')
        stream.on('data', (chunk) => {
            const actualData = chunk.toString().split(endOfLine)
            console.log(actualData)
            const rl = readline.createInterface({
                input: s.Readable.from(chunk.toString()),
                crlfDelay: Infinity
            });
            rl.on('line', function (line) {
                if (line.includes(`"time": "2020-01-22T17:00:00Z",`)){
                    console.log(g.length,"kl")
                }
                g.push(line)
                // console.log('Line from file:', line);
            });
            // lines+=actualData.length
            // console.log(actualData[actualData.length-1])
            // console.log(actualData,lines)
            // actualData.map(string => console.log(string))
            // stream.pause()
        })
        // .on('data', (d) => {
        //     lines++
        //     const split = d.toString().split(/\r|\n/)
        //     console.log(split.length)
        // })
        // .on('error', (err) => {
        //     console.log(err)
        // })
        stream.on('end', () => {
            fs.writeFile('heloinfo.txt', `There are ${lines} lines and the size of the file is ${size} KB`, (err) => {
                if(err) {
                    throw err
                }
                console.timeEnd('Read')
                console.log('Fini')
                console.log(g.length,g[14721737-1])
            })
        })

    })
}

//TODO 
// Write how many lines and how big file is in another file
// Make it faster
// Get the first 10 characters
