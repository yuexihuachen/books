const btnBase64 = document.getElementById("btnForm")
const btnHand = document.getElementById("handformFile")
const fileListBtn = document.querySelector('.file__list')
let arrayBufferStr = '',fileName = '',fileType =''

btnBase64.addEventListener("change", function() {
  let file = this.files[0]
  fileName = file.name
  fileType = file.type
  let reader  = new FileReader();
  reader.addEventListener("load", function (e) {
    arrayBufferStr = e.target.result
  });
  reader.readAsArrayBuffer(file);
})

btnHand.addEventListener("click", () => {
  let fd = new FormData()
  fileName = encodeURIComponent(fileName)
  let file = new File([arrayBufferStr],fileName, { type: fileType })
  fd.append("sampleFile", file)

  fetch('/uploadFormFile', {
    method: 'POST',
    body: fd
  })
  .then(result => {
    alert('upload Success');
  })
  .catch(error => {
    console.error('Error:', error);
  });
})

fileListBtn.addEventListener("click", (e) => {
  console.log(e.target)
})

