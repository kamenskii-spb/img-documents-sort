const path = require("path")
const fs = require("fs")

module.exports = {
  fetchFiles: (directoryPath = path.join(__dirname, "..", "documents")) => {
    try {
      return fs.readdirSync(directoryPath)
    } catch (error) {
      return false
    }
  },
  fetchBeetwin: (text, to, before, quotes = false) => {
    try {
      const t = text.split(to)[1].split(before)[0]
      if (quotes) {
       return t.split('"')[1].split('"').join('')
      }
      return t

    } catch (error) {
      return false
    }
  },
}
