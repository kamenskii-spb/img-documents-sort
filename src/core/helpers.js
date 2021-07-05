const path = require("path")
const fs = require("fs")

module.exports = {
  fetchFiles: (directoryPath = path.join(__dirname,"..","documents")) => {
    try {
      return fs.readdirSync(directoryPath)
    } catch (error) {
      return false
    }
  },
  fetchBeetwin: (text, to, before) => {
    try {
      const arr = text.split("Продавец")
      const name = arr[1].split("Адрес")
      return name[0]
    } catch (error) {
      return false
    }
  },
}
