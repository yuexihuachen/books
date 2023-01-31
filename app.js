const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require("fs")
const cookieParser = require('cookie-parser')

const app = express()
const port = 3001

app.use(cookieParser())
app.use(express.static('.'));
app.use(express.json({
  limit: 50 * 1024 * 1024
}));
app.use(fileUpload({
  limit: 50 * 1024 * 1024
}));
//web/viewer.html?file=%2Fpdfs%2F前端架构设计.pdf

app.get('/', (req, res) => {
  const bookList = fs.readdirSync(`${__dirname}/pdfs`)
  const bookHtml = bookList.map(bookName => `<p>
    <a target="_blank" href='web/viewer.html?file=%2Fpdfs%2F${bookName}'>
    ${bookName}
    </a>
  </p>`)
  const html = `
    <h1>Book List</h1>
    ${bookHtml.join('')}
  `
  res.send(html)
})

app.get('/bookupload', (req, res) => {
  let uploadHtml = `
  <label class="file-label" for="btnForm">
    <input id="btnForm" type="file" name="resume">
  </label>
  <button id="handformFile">upload file</button>
  <script src="/public/js/index.js"></script>
  `
  res.send(uploadHtml)
})



app.post("/uploadFormFile", (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/pdfs/' + decodeURIComponent(sampleFile.name);

  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send({
      result: 'File uploaded success!'
    });
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
