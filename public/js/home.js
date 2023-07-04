const fileListBtn = document.querySelector('.file__list')

fileListBtn.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const name = e.target.dataset.name
    fetch('/deleteFile', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name
      })
    })
    .then(res => res.json())
    .then(result => {
      alert(result.message);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
})

