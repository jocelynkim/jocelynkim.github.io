/*
        
        FILL IN THESE VARIABLES BASED ON THE GUIDE AT https://drawbox.nekoweb.org
        
        
				      /`·.¸
				     /¸...¸`:·
				 ¸.·´  ¸   `·.¸.·´)
				: © ):´;      ¸  {
				 `·.¸ `·  ¸.·´\`·¸)
				     `\\´´\¸.·´
        
*/
const GOOGLE_FORM_ID = "1FAIpQLSelB8y0I6b4hl-MhW5KXHUdohlIapY0TVIZh9w4THWauLZWYA";
const ENTRY_ID = "entry.1476642798";
const GOOGLE_SHEET_ID = "1YNfzsd3irvwLzeodYUi5DMNjyT2bsF0a7T9-bWDSaxI";
const DISPLAY_IMAGES = true;

/*
        
        DONT EDIT BELOW THIS POINT IF YOU DONT KNOW WHAT YOU ARE DOING.
        
*/

const CLIENT_ID = "b4fb95e0edc434c";
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/" + GOOGLE_SHEET_ID + "/export?format=csv";
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/" + GOOGLE_FORM_ID + "/formResponse";

let canvas = document.getElementById("drawboxcanvas");
let context = canvas.getContext("2d");

let restore_array = [];
let start_index = -1;
let redo_array = [];
let stroke_color = "black";
let stroke_width = "2";
let is_drawing = false;

function initCanvas() {
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  start_index = 0;
  redo_array = [];
}
initCanvas();

function change_color(element) {
  stroke_color = element.style.background;
}

function start(event) {
  is_drawing = true;
  context.beginPath();
  context.moveTo(getX(event), getY(event));
  event.preventDefault();
}

function draw(event) {
  if (!is_drawing) return;
  context.lineTo(getX(event), getY(event));
  context.strokeStyle = stroke_color;
  context.lineWidth = stroke_width;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
  event.preventDefault();
}

function stop(event) {
  if (!is_drawing) return;
  context.stroke();
  context.closePath();
  is_drawing = false;
  restore_array = restore_array.slice(0, start_index + 1);
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  start_index++;
  redo_array = [];
  event.preventDefault();
}

function getX(event) {
  const rect = canvas.getBoundingClientRect();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  return (clientX - rect.left) * (canvas.width / rect.width);
}

function getY(event) {
  const rect = canvas.getBoundingClientRect();
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  return (clientY - rect.top) * (canvas.height / rect.height);
}

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function Restore() {
  if (start_index <= 0) return;
  redo_array.push(restore_array[start_index]);
  start_index--;
  context.putImageData(restore_array[start_index], 0, 0);
}

function Redo() {
  if (redo_array.length === 0) return; // nothing to redo

  const data = redo_array.pop(); // get the last undone state
  start_index++;
  restore_array[start_index] = data; // restore it back to main stack
  context.putImageData(data, 0, 0);
}

function Clear() {
  restore_array = restore_array.slice(0, start_index + 1);
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  start_index++;
  context.fillStyle = "white";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  redo_array = [];
}

context.drawImage = function() {
	console.warn("noo >:(");
};

document.getElementById("submit").addEventListener("click", async function () {
  const submitButton = document.getElementById("submit");
  const statusText = document.getElementById("status");

  submitButton.disabled = true;
  statusText.textContent = "Uploading...";

  const imageData = canvas.toDataURL("image/png");
  const blob = await (await fetch(imageData)).blob();
  const formData = new FormData();
  formData.append("image", blob, "drawing.png");

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: `Client-ID ${CLIENT_ID}` },
      body: formData,
    });

    const data = await response.json();
    if (!data.success) throw new Error("Imgur upload failed");

    const imageUrl = data.data.link;
    console.log("Uploaded image URL:", imageUrl);

    const googleFormData = new FormData();
    googleFormData.append(ENTRY_ID, imageUrl);

    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      body: googleFormData,
      mode: "no-cors",
    });

    statusText.textContent = "Upload successful!";
    alert("Image uploaded and submitted successfully ☻");
    location.reload();
  } catch (error) {
    console.error(error);
    statusText.textContent = "Error uploading image.";
    alert("Error uploading image or submitting to Google Form.");
  } finally {
    submitButton.disabled = false;
  }
});

async function fetchImages() {
  if (!DISPLAY_IMAGES) {
    console.log("Image display is disabled.");
    return;
  }

  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const csvText = await response.text();
    const rows = csvText.split("\n").slice(1);

    const gallery = document.getElementById("gallery");
    const counter = document.getElementById("gallery-counter");
    gallery.innerHTML = "";

    let imageCount = 0;

    rows.reverse().forEach((row) => {
      const columns = row.split(",");
      if (columns.length < 2) return;

      const timestamp = columns[0].trim();
      const imgUrl = columns[1].trim().replace(/"/g, "");

      if (imgUrl.startsWith("http")) {
        const div = document.createElement("div");
        div.classList.add("image-container");

        div.innerHTML = `
                    <img src="${imgUrl}" alt="drawing">
                    <p>${timestamp}</p>
                `;
        gallery.appendChild(div);
        imageCount++;
      }
    });
    counter.textContent = `Submitted Drawings (${imageCount})`;
  } catch (error) {
    console.error("Error fetching images:", error);
    document.getElementById("gallery").textContent = "Failed to load images.";
  }
}

fetchImages();
