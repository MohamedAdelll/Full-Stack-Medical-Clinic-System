const input = document.querySelector("#file");
const rightArr = document.querySelector(".fa-solidArrR");
const leftArr = document.querySelector(".fa-solidArrL");

input.addEventListener("change", handleImgs);

function handleImgs(e) {
  let { files } = e.target;
  if (!files.length > 1) return;
  document
    .querySelectorAll(".fa-solidArr")
    .forEach((arr) => arr.classList.add("active"));
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith("image/")) continue;
    const imgsDiv = document.querySelector(".images-div");
    const div = document.createElement("div");
    div.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    div.classList.add("img-mod");
    div.setAttribute("data-imgNo", i + 1);
    imgsDiv.appendChild(div);
  }
  files = [...files];
  files.forEach((_, index) => {
    const i = document.createElement("i");
    if (index === 0) i.classList.add("fa-solid", "fa-circle");
    else i.classList.add("fa-regular", "fa-circle");
    document.querySelector(".dot-container").appendChild(i);
  });
}

let index = 0;

rightArr.addEventListener("click", swipeRight);
leftArr.addEventListener("click", swipeLeft);

function swipeRight() {
  const imgsArr = document.querySelectorAll(".img-mod");
  if (imgsArr.length == 0 || imgsArr.length === 1) return;
  index += -100;
  if (index === imgsArr.length * -100) index = 0;
  imgsArr.forEach((img, i) => {
    img.style.transform = `translateY(${index}%)`;
  });
  handleDots(index / -100);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") swipeRight();
  if (e.code === "ArrowLeft") swipeLeft();
});
function swipeLeft() {
  const imgsArr = document.querySelectorAll(".img-mod");
  if (imgsArr.length === 0 || imgsArr.length === 1) return;
  if (index === 0) index = imgsArr.length * -100;
  index += 100;
  imgsArr.forEach((img, i) => {
    img.style.transform = `translateY(${index}%)`;
  });
  handleDots(index / -100);
}

function handleDots(i) {
  const dotNo = i;
  const dotsArr = document.querySelectorAll(".fa-circle");
  dotsArr.forEach((dot, i) => {
    dot.classList.remove("fa-solid");
    dot.classList.add("fa-regular");
  });
  dotsArr.forEach((dot, i) => {
    if (i === dotNo) {
      dot.classList.add("fa-solid");
      dot.classList.remove("fa-regular");
    }
  });
}
