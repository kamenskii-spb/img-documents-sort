const path = require("path")
const pdf = require("pdf-poppler")

const pdfConvert = async (file, format = 'jpeg') => {

    
  let opts = {
    format,
    out_dir: __dirname + "/../tmp",
    out_prefix: "pdf_in_" + format,
    page: null,
    scale: 1300,
  }

  try {
     await pdf.convert(file, opts)

     return {
       path: __dirname + "/../tmp/" + opts.out_prefix+'-1.'+format,
     }
         
         
  } catch (error) {
        console.error(error)
  }



}

module.exports = {
    pdfConvert
}
