const express = require('express')
const path = require('path')
const app = express()
const multer = require('multer')
app.use('/static', express.static('public'))
app.use(express.static('uploads'))
const { PDFNet } = require('@pdftron/pdfnet-node');
const port = 3000


let bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})


app.post('/pdftodocx', upload.single('pdfs'), async (req, res, next) => {
    console.log(req.files)
    async function main() {
        await PDFNet.addResourceSearchPath('./');

        if (!(await PDFNet.StructuredOutputModule.isModuleAvailable())) {

            return;
        }

        await PDFNet.Convert.fileToWord(req.file.path, 'public/output.docx');
    }

    await PDFNet.runWithCleanup(main, 'demo:620105@student.nitandhra.ac.in:7dd210d102000000001c5dbe9334d2673fcb5ce07ea919f56baae8ef06');
    res.download('public/output.docx', () => {

    })
    // res.redirect("https://www.google.com/")
})

app.listen(3000, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})