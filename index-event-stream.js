const http = require("http")
const fs = require("fs")
const readline = require('readline')
const es = require('event-stream')

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

        fs.createReadStream('./helo.json')
        .pipe(es.split())
        .pipe(es.map(function (data,cb) {
            lines++
            cb(null, data)
        }))
        .on('end', () => {
            fs.writeFile('heloinfo.txt', `There are ${lines} lines and the size of the file is ${size} KB`, (err) => {
                if(err) {
                    throw err
                }
                console.timeEnd('Read')
                console.log('Fini')
            })
        })

    })
}

//TODO 
// Write how many lines and how big file is in another file
// Make it faster
// Get the first 10 characters
