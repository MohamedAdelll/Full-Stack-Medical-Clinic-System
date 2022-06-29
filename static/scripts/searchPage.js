import {
  handleInputID,
  handleInputName,
  handleSuggestions,
  currPatient,
} from "./search.js";

const spanBtn = document.querySelectorAll(".btn-span");
const divShow = document.querySelector(".button-div.show");
const divBack = document.querySelector(".button-div.back");
const main = document.querySelector(".form-main");

const inputName = document.querySelector("#input-name");
const inputID = document.querySelector("#input-id");
const suggested = document.querySelector(".suggested-names");

spanBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log(btn.textContent);
    if (btn.textContent === "Show") {
      const html = `<h3 class="tertiary-heading">Personal information</h3>
        <div class="name-row justify-center">
      <label for="FN">Full Name</label>
      <p class="label-search">${currPatient.Name}</p>
      </div>
      <div class="name-row">
      <label for="sex">Sex</label>
      <p class="label-search">${
        currPatient.Gender === 1 ? "Male" : "Female"
      }</p>
      
      <label for="age">Age</label>
      <p class="label-search">${currPatient.Age}</p>
      <label min="0" step="1" for="Tel">Tel. number</label>
      <p class="label-search">${currPatient.Tel}</p>
      </div>
      <div class="name-row justify-center">
      <label for="Res">Residence</label>
      <p class="label-search margin-r-xxl">${currPatient.Address}</p>
      </div>
  `;

      divShow.classList.add("hidden");
      divBack.classList.remove("hidden");
      main.innerHTML = "";
      main.innerHTML = html;
    }
    if (btn.textContent === "Back") {
      inputID.value = "";
      inputName.value = "";
      main.innerHTML = "";
      divShow.classList.remove("hidden");
      divBack.classList.add("hidden");
    }
  });
});

inputName.addEventListener("keyup", handleInputName);
suggested.addEventListener("keyup", handleSuggestions);
inputID.addEventListener("keyup", handleInputID);
