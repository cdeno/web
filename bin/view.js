const fs = require('fs')
const util = require('util')
const hv = require('hyperviews')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

module.exports = async (file) => {
  const input = await readFile(file, 'utf-8')
  const output = hv(input, 'esm')
  const outfile = file + '.js'
  await writeFile(file + '.js', output)
  return { file: outfile, output }
}
