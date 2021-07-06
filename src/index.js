const { createWorker } = require("tesseract.js")
const { fetchFiles, fetchBeetwin } = require("./core/helpers")

const { pdfConvert } = require("./core/convert")
const JSONdb = require("simple-json-db")

const db = new JSONdb(__dirname + "/core/database.json")

const client = 'hhghh'

const docDb = db.get("documents")
const dbDocuments = docDb ? JSON.parse(docDb) : []

console.log(dbDocuments)

async function start() {
  const files = await fetchFiles()
  const documents = await fetchDocuments(files)

  if (!dbDocuments.length) db.set("documents", JSON.stringify(documents))

}



start()

async function fetchDocuments(files) {
  if (!files.length) return

  const documents = []
  for await (const file of files) {
    const pdfInJpg = await pdfConvert(__dirname + "/documents/" + file, "jpg")

  
    const doc = dbDocuments.find((d) => d?.fileName === file)
    if (!doc) {
      console.log(file)

      const worker = createWorker({
        langPath: __dirname + "/rus.traineddata",
        logger: (m) => console.log(`${file}progress: ${m.progress}`),
      })

      await worker.load()
      await worker.loadLanguage("rus")
      await worker.initialize("rus")
      const {
        data: { text },
      } = await worker.recognize(__dirname + "/tmp/pdf_in_jpg-1.jpg")
      await worker.terminate()

        const document = {
          fileName: file,
          organization:
            fetchBeetwin(text, "Продавец", "Адрес", true) ||
            fetchBeetwin(text, "Грузополучатель", "Адрес", true) ||
            fetchBeetwin(text, "Поставщик", "Грузоотправитель", true) ||
            "Не найден",
          text: text,
          isCheck: false,
        }
        documents.push(document)
      
    } else {

  

              const document = {
                fileName: file,
                organization: doc.organization,
                text: doc.text,
                isCheck: false,
                in: doc.organization === client
              }
              console.log(doc.organization)
              documents.push(document)


    }
  }

  return documents
}
