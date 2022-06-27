import getPatients from "./getPatients.js";

const main = document.querySelector(".form-main");
const inputName = document.querySelector("#input-name");
const inputID = document.querySelector("#input-id");
const suggested = document.querySelector(".suggested-names");
const spanBtn = document.querySelectorAll(".btn-span");
const divShow = document.querySelector(".button-div.show");
const divBack = document.querySelector(".button-div.back");

const data = JSON.parse(await getPatients());
console.log(data);
const patientsNamesL = data.map((patient) => patient.Name.toLowerCase());

inputName.addEventListener("keyup", () => {
  const userInput = inputName.value.toLowerCase();
  console.log(userInput);
  if (!userInput) {
    suggested.innerHTML = "";
    return;
  }
  const newOutput = patientsNamesL.filter((patient) => {
    return patient.startsWith(userInput);
  });
  const listItemsArr = newOutput.map(
    (name) => `<li>${capitalizeInitials(name)}</li>`
  );
  suggested.innerHTML = listItemsArr.join("");
});

function capitalizeInitials(str) {
  return str
    .split(" ")
    .map((name) => name[0].toUpperCase() + name.slice(1))
    .join(" ");
}
let currPatient;
suggested.addEventListener("click", (e) => {
  inputName.value = e.target.textContent;
  suggested.innerHTML = "";
  currPatient = data.find(
    (currPatient) => currPatient.Name === inputName.value
  );
  const id = currPatient.ID;
  inputID.value = id;
});
console.log(spanBtn);
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
    <p class="label-search">${currPatient.Gender === 1 ? "Male" : "Female"}</p>
    
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

inputID.addEventListener("keyup", () => {
  if (inputID.value.length !== 6) return;
  currPatient = data.find((patient) => patient.ID === +inputID.value);
  console.log(currPatient);
  inputName.value = capitalizeInitials(currPatient.Name);
});
