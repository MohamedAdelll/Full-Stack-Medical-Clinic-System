"use strict";

const listItems = document.querySelectorAll(".nav-item");
const nav = document.querySelector(".navigation");
const deleteIcons = document.querySelectorAll(".fa-xmark");

nav.addEventListener("click", navHandler);

function navHandler(e) {
  e.preventDefault();
  if (!e.target.closest(".nav-item")) return;
  const navItem = e.target.closest(".nav-item");
  listItems.forEach((list) => list.classList.remove("active"));
  navItem.classList.add("active");
}

deleteIcons.forEach((icon) => {
  icon.addEventListener("click", delIconHandler);
});

function delIconHandler(e) {
  e.preventDefault();
  document
    .querySelectorAll(".content-header input")
    .forEach((input) => (input.value = ""));
}
