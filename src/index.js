const Tesseract = require("tesseract.js")
const { fetchFiles, fetchBeetwin } = require("./core/helpers")

const { pdfConvert } = require("./core/convert")
const JSONdb = require("simple-json-db")

const db = new JSONdb(__dirname + "/core/database.json")


 console.log(JSON.parse(db.get("documents")))

async function start() {

 const files = await fetchFiles()
 const documents = await fetchDocuments(files)

  db.set("documents", JSON.stringify(documents))
   
}

 //start()



 async function fetchDocuments (files) {

  if(!files.length) return


    const documents = []
    for  await(const file of files) {
      const pdfInJpg = await pdfConvert(__dirname + "/documents/" + file, "jpg")

     await Tesseract.recognize(pdfInJpg.path, "rus", {
        logger: (e) => console.log(e),
      }).then((out) => {
        const text = out.data.text

        const document = {
          seller: fetchBeetwin(text, "Продавец", "Адрес") || 'Не найден',
          text: out.data.text,
          isCheck: false,
        }

          documents.push(document)
        
      })
  
    }
    return documents
 }


