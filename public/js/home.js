const fileListBtn = document.querySelector('.file__list')


fileListBtn.addEventListener("click", (e) => {
  const classList = e.target.classList
  if (classList.contains("delete")) {
    const name = e.target.dataset.name
    const path = e.target.dataset.path
    fetch('/deleteFile', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        path
      })
    })
      .then(res => res.json())
      .then(result => {
        alert(result.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else if (classList.contains("download")) {
    const fileName = e.target.dataset.name
    const path = e.target.dataset.path
    fetch(`/downloadFile?fileName=${fileName}&path=${path}`, {
      method: 'GET'
    })
      .then(result => {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = result.url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })


  }
})

