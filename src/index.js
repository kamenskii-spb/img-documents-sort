const Tesseract = require("tesseract.js")
const { fetchFiles, fetchBeetwin } = require("./core/helpers")

const { pdfConvert } = require("./core/convert")
const JSONdb = require("simple-json-db")

const db = new JSONdb(__dirname + "/core/database.json")


const dbDocuments = JSON.parse(db.get("documents"))

console.log(dbDocuments)

async function start() {

 const files = await fetchFiles()
 const documents = await fetchDocuments(files)


//if(!documents.length) db.set("documents", JSON.stringify(documents))
   
}

 start()



 async function fetchDocuments (files) {
    

  if(!files.length) return


    const documents = []
    for  await(const file of files) {
      const pdfInJpg = await pdfConvert(__dirname + "/documents/" + file, "png")

 

    //  if(dbDocuments.find( d => d.fileName !== file)){

        console.log(file)

    
        await Tesseract.recognize(pdfInJpg.path, "rus", {
        logger: (e) => console.log(e.progress),
      }).then((out) => {
        const text = out.data.text

        const document = {
          fileName: file,
          seller: fetchBeetwin(text, "Продавец", "Адрес") || fetchBeetwin(text, "Грузополучатель", "Адрес") || 'Не найден',
          text: out.data.text,
          isCheck: false,
        }

          documents.push(document)
        
      })


    //  }




  
    }
    return documents
 }


