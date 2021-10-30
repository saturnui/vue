const glob = require('fast-glob')
const path = require('path')
const fs = require('fs')

const rootPath = path.join(__dirname, '..')
const distPath = path.join(__dirname, '..', 'comps')
fs.rmdirSync(distPath, { recursive: true })
const files = glob.sync(path.join(__dirname, '..', 'src', '**', '*.vue'), { onlyFiles: true })
console.log(rootPath)
// console.log(files)

files.forEach(file => {
  console.log(file)
  // const relPath = file.replace(rootPath + '/src', '')
  const s = fs.readFileSync(file).toString()
  // console.log(s)
  // fs.writeFileSync(path.join(distPath + relPath), s)
})
