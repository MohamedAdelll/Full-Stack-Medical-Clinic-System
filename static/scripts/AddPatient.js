import getPatients from "./getPatients.js";

const data = JSON.parse(await getPatients());
console.log(data);

let patientID;
const lastPatient = data[data.length - 1];

const date = new Date();
const currMonth = (date.getMonth() + 1 + "").padStart(2, 0);
const currYear = (date.getFullYear() + "").slice(2);

const firstName = document.querySelector("#FN");
const middleName = document.querySelector("#MN");
const lastName = document.querySelector("#LN");

const form = document.querySelector(".form");
const res = document.querySelector("#Res");
const hiddenSelect = document.querySelector("select.hidden option");

if (data.length === 0) {
  patientID = currYear + currMonth + "00";
} else if (lastPatient.ID.toString().slice(2, 4) === currMonth) {
  patientID =
    currYear +
    currMonth +
    (+lastPatient.ID.toString().slice(4) + 1).toString().padStart(2, 0);
} else if (lastPatient.ID.toString().slice(2, 4) !== currMonth) {
  patientID = currYear + currMonth + "00";
}

form.addEventListener("submit", () => {
  hiddenSelect.setAttribute("value", patientID);
  firstName.value = capitalizeInitials(firstName.value);
  middleName.value = capitalizeInitials(middleName.value);
  lastName.value = capitalizeInitials(lastName.value);
  lastName.value = capitalizeInitials(lastName.value);
  res.value = capitalizeInitials(res.value);
});

console.log(patientID);

function capitalizeInitials(str) {
  return str
    .split(" ")
    .map((name) => name[0].toUpperCase() + name.slice(1))
    .join(" ");
}
