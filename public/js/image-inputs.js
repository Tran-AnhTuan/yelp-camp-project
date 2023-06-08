const images = document.getElementById("images");
const count = document.getElementById("count");
const thumbnails = document.getElementById("thumbnails");
const fileNames = document.getElementById("file-names");
images.addEventListener("change", (event) => {
  thumbnails.innerHTML = "";
  fileNames.innerText = "";
  const number = images.files.length;
  count.innerText = number;
  for (i = 0; i < number; i++) {
    const url = URL.createObjectURL(event.target.files[i]);
    thumbnails.innerHTML += `<img src="${url}" alt="thumb">`;
    fileNames.innerText += `${event.target.files[i].name}; \xA0`;
  }
});
