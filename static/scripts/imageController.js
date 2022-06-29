let index = 0;

export function swipeRight() {
  const imgsArr = document.querySelectorAll(".img-mod");
  if (imgsArr.length == 0 || imgsArr.length === 1) return;
  index += -100;
  if (index === imgsArr.length * -100) index = 0;
  imgsArr.forEach((img, i) => {
    img.style.transform = `translateY(${index}%)`;
  });
  handleDots(index / -100);
}
export function swipeLeft() {
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
  const dotsArr = document.querySelectorAll(".fa-circle");
  const dotNo = i % dotsArr.length;
  dotsArr.forEach((dot) => {
    dot.classList.remove("active");
  });
  dotsArr.forEach((dot, i) => {
    if (i === dotNo) dot.classList.add("active");
  });
}
