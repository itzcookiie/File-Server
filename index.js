const express = require('express');
const fs = require('fs');
const { urlencoded } = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req,res) => {
    // fs.readFile('data.txt', (err, data) => {
    //     if(err) throw err;
    //     res.writeHead(200, {'Content-Type': 'text/html'});
    //     res.write(data);
    //     return res.end
    // })
    fs.readdir('./', (err,files) => {
        if(err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        for(let f of files) {
        res.write(f + '<br>');
    }
        return res.end
    })
})

app.post('/file/:name', (req,res) => {
    const { name } = req.params
    console.log(req.body)
    const content = 'Newly created file incoming!'
    const fileName = `${name}.exe`, fileInfoName = `${name}info.exe`;
    fs.writeFile(`${name}.exe`, content, (err) => {
        if(err) throw err;
        console.log('It worked!')
        fs.readdir('./', (err, files) => {
            if(err) throw err;
            for(let file of files) {
                if(file === `${name}.exe`) {
                    fs.readFile(file, (err, data) => {
                        if(err) throw err;
                        const length = data.length, size = fs.statSync(file).size;
                        fs.writeFile(`${name}info.exe`, `There are ${length} characters and size of the file is ${size} bytes`, err => {
                            if(err) throw err;
                        })
                    })
                }
            }
        })
    })
})

app.listen(8000, () => {
    console.log('Server running on port 8000!')
})