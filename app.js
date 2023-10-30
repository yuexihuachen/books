const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require("fs")
const cookieParser = require('cookie-parser')
const path = require('path');
const st = require('st');

const app = express()
const port = 3001

const mount = st({
  path: 'jsondir',
  cache: true
})
app.use('/jsondir',mount)
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
  const bookList = fs.readdirSync(`${__dirname}/pdfsdir`)
  const bookHtml = bookList.map(bookName => `<p>
    <a target="_blank" href='web/viewer.html?file=%2Fpdfsdir%2F${bookName}'>
    ${bookName}
    </a>
    <a data-path='pdfsdir' data-name='${bookName}' class="download">下载</a>
    <button data-name="${bookName}" data-path="pdfsdir" class="delete">删除</button>
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
  const bookList = fs.readdirSync(`${__dirname}/filesdir`)
  const bookHtml = bookList.map(bookName => `<p>
    <a>
    ${bookName}
    </a>
    <a data-path='filesdir' data-name='${bookName}' class="download">下载</a>
    <button data-name="${bookName}" data-path="filesdir" class="delete">删除</button>
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

app.get("/downloadFile", (req, res, next) => {
  const params = req.query;
  const fileStream = fs.createReadStream(`./${params.path}/${params.fileName}`);
  fileStream.on("open",() => {
    res.attachment(params.fileName);
    fileStream.pipe(res)
  })

  fileStream.on("error",(err) => {
    next(err)
  })

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

  uploadPath = '/wrokspace/filesdir/' + fileName;

  if (fileName.includes(".json")) {
    uploadPath = '/wrokspace/jsondir/' + fileName;
  }

  if (fileName.includes(".pdf")) {
    uploadPath = '/wrokspace/pdfsdir/' + fileName;
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
