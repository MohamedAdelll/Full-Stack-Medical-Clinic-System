import getPatients from "./getPatients.js";

const inputName = document.querySelector("#input-name");
const inputID = document.querySelector("#input-id");
const suggested = document.querySelector(".suggested-names");

const data = JSON.parse(await getPatients());

const patientsNamesL = data.map((patient) => patient.Name.toLowerCase());

export const handleInputName = () => {
  const userInput = inputName.value.toLowerCase();
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
};
inputName.addEventListener("keyup", handleInputName);

function capitalizeInitials(str) {
  return str
    .split(" ")
    .map((name) => name[0].toUpperCase() + name.slice(1))
    .join(" ");
}

export let currPatient;

export const handleSuggestions = (e) => {
  inputName.value = e.target.textContent;
  suggested.innerHTML = "";
  currPatient = data.find((curPatient) =>{
    console.log(curPatient.Name, inputName.value);
    return curPatient.Name.toLowerCase() === inputName.value.toLowerCase()
  });
  console.log('hi', currPatient)
  const id = currPatient.ID;
  inputID.value = id;
};

suggested.addEventListener("click", handleSuggestions);

export const handleInputID = () => {
  if (inputID.value.length !== 6) return;
  currPatient = data.find((patient) => patient.ID === +inputID.value);
  console.log(currPatient);
  inputName.value = capitalizeInitials(currPatient.Name);
};

inputID.addEventListener("keyup", handleInputID);
