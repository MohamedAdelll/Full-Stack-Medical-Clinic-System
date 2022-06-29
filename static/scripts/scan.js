import {
  handleInputID,
  handleInputName,
  handleSuggestions,
  currPatient,
} from "./search.js";

import { swipeLeft, swipeRight } from "./imageController.js";

const inputName = document.querySelector("#input-name");
const inputID = document.querySelector("#input-id");
const suggested = document.querySelector(".suggested-names");

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
    let html;
    if (index === 0)
      html = `
    <svg class="fa-circle active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z"/></svg>
    
    `;
    else
      html = `    <svg class="fa-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z"/></svg>
    `;
    document
      .querySelector(".dot-container")
      .insertAdjacentHTML("beforeend", html);
  });
}

rightArr.addEventListener("click", swipeRight);
leftArr.addEventListener("click", swipeLeft);

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") swipeRight();
  if (e.code === "ArrowLeft") swipeLeft();
});

inputName.addEventListener("keyup", handleInputName);
suggested.addEventListener("keyup", handleSuggestions);
inputID.addEventListener("keyup", handleInputID);
