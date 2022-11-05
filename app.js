let input = document.getElementById("input");

WIDTH = 800;

input.addEventListener("change", (event) => {
  let image_file = event.target.files[0];

  console.log("Original File", image_file);

  console.log("file 1", formatFileSize(image_file.size));

  let reader = new FileReader();

  reader.readAsDataURL(image_file);

  reader.onload = (event) => {
    image_url = event.target.result;
    let image = document.createElement("img");
    image.src = image_url;

    image.onload = (e) => {
      let canvas = document.createElement("canvas");
      let ratio = WIDTH / image.width;
      canvas.width = WIDTH;
      canvas.height = image.height * ratio;

      let context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      let new_image_url = canvas.toDataURL("image/jpeg", 98);

      // console.log("Image URL: ", new_image_url)

      let image_file = urlToFile(new_image_url);
      uploadImage(image_file);
    };
  };
});

let urlToFile = (url) => {
  let arr = url.split(",");
  // console.log(arr)
  let mime = arr[0].match(/:(.*?);/)[1];
  let data = arr[1];

  let dataStr = atob(data);
  let n = dataStr.length;
  let dataArr = new Uint8Array(n);

  while (n--) {
    dataArr[n] = dataStr.charCodeAt(n);
  }

  let file = new File([dataArr], "File.jpg", { type: mime });

  return file;
};

let uploadImage = (file) => {
  console.log("file 2", formatFileSize(file.size));

  // upload to server
  const url = "http://filemanager.test/api/upload";

  let payload = new FormData();
  payload.append("file", file);

  fetch(url, {
    method: "POST",
    body: payload,
  });
};

// helpers

function formatFileSize(bytes, decimalPoint) {
  if (bytes == 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
