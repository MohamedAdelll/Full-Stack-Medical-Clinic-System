import getPatients from "./getPatients.js";

const data = JSON.parse(await getPatients());
console.log(data);

let patientID;
const date = new Date();
const currMonth = (date.getMonth() + 1 + "").padStart(2, 0);
const currYear = (date.getFullYear() + "").slice(2);
const hiddenSelect = document.querySelector("select.hidden option");
const form = document.querySelector(".form");
console.log(data);
const lastPatient = data[data.length - 1];
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

console.log(patientID);
form.addEventListener("submit", () => {
  hiddenSelect.setAttribute("value", patientID);
});
