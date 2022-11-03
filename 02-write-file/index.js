const {stdin, exit } = require('process')
const { join } = require('path')
const fs = require('fs')
const stream = fs.createWriteStream(join(__dirname, 'text.txt'))
const gate = () => {
  console.log('Exit')
  exit()
}

console.log('Hello! Enter text:')
stdin.on('data', text => {
  process.on('SIGINT', gate)
  if (text.toString().trimEnd() === 'exit') gate()
  stream.write(text)
})