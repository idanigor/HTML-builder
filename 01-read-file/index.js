const fs = require ('fs')
const { join } = require ('path')

fs.ReadStream(join(__dirname, 'text.txt'), 'utf-8').on('data', data => console.log(data))