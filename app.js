const fs = require('fs')
const path = require('path')
const fetch = require("node-fetch")


const data = fs.readFileSync("./test1.json")

console.time('POST')
fetch("http://localhost:8000?filename=test1.json", {
    method:"POST",
    body:data
}).then(f => {
    console.log(f.status, f.ok)
    console.timeEnd('POST')
})