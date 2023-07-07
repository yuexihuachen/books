const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require("fs")
const cookieParser = require('cookie-parser')
const path = require('path');
const st = require('st');

const app = express()
const port = 3001

const mount = st({
  path: 'json',
  cache: true
})
app.use('/json',mount)
app.use(cookieParser())
app.use(express.static('.'));
app.use(express.json({
  limit: 100 * 1024 * 1024
}));
app.use(fileUpload({
  limit: 100 * 1024 * 1024
}));
//web/viewer.html?file=%2Fpdfs%2F前端架构设计.pdf

app.get('/', (req, res) => {
  const bookList = fs.readdirSync(`${__dirname}/pdfs`)
  const bookHtml = bookList.map(bookName => `<p>
    <a target="_blank" href='web/viewer.html?file=%2Fpdfs%2F${bookName}'>
    ${bookName}
    </a>
    <a target="_blank" href='/pdfs/${bookName}' class="download">下载</a>
    <button data-name="${bookName}" data-path="pdfs" class="delete">删除</button>
  </p>`)
  const html = `
    <link rel="stylesheet" href="/styles/customize.css">
    <h1>Book List</h1>
    <div class="file__list">
    ${bookHtml.join('')}
    </div>
    <script src="/public/js/home.js"></script>
  `
  res.send(html)
})


app.get('/file', (req, res) => {
  const bookList = fs.readdirSync(`${__dirname}/file`)
  const bookHtml = bookList.map(bookName => `<p>
    <a target="_blank" href='web/viewer.html?file=%2Fpdfs%2F${bookName}'>
    ${bookName}
    </a>
    <a target="_blank" href='/pdfs/${bookName}' class="download">下载</a>
    <button data-name="${bookName}" data-path="file" class="delete">删除</button>
  </p>`)
  const html = `
    <link rel="stylesheet" href="/styles/customize.css">
    <h1>File List</h1>
    <div class="file__list">
    ${bookHtml.join('')}
    </div>
    <script src="/public/js/home.js"></script>
  `
  res.send(html)
})


app.get('/fileupload', (req, res) => {
  let uploadHtml = `
  <label class="file-label" for="btnForm">
    <input id="btnForm" type="file" name="resume">
  </label>
  <button id="handformFile">upload file</button>
  <script src="/public/js/index.js"></script>
  `
  res.send(uploadHtml)
})

app.post("/deleteFile", (req, res) => {
  const query = req.body
  let result = {
    message: `failed to delete`
  }
  try {
    const filePath = path.join(__dirname,`${query.path}/${query.name}`)
    fs.unlinkSync(filePath)
    result.message = `successfully deleted ${query.name}`
  } catch (err) {

  }
  
  res.send(result)
})

app.post("/uploadFormFile", (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  sampleFile = req.files.sampleFile;
  const fileName = decodeURIComponent(sampleFile.name)

  uploadPath = '/wrokspace/file/' + fileName;

  if (fileName.includes(".json")) {
    uploadPath = '/wrokspace/json/' + fileName;
  }

  if (fileName.includes(".pdf")) {
    uploadPath = '/wrokspace/pdfs/' + fileName;
  }

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
