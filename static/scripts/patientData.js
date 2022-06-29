import { swipeLeft, swipeRight } from "./imageController.js";

const form = document.querySelector(".form");
const scansContainer = document.querySelector(".scans-container");
const examsContainer = document.querySelector(".exam-container");

const urls = [
  "/static/json_patients.json",
  "/static/json_scans.json",
  "/static/json_exams.json",
];

let [patients, scans, exams] = await Promise.all(
  urls.map(async (url) => {
    const resp = await fetch(url);
    return resp.json();
  })
);

patients = JSON.parse(patients);
scans = JSON.parse(scans);
exams = JSON.parse(exams);

const currPatient =
  patients.find((curPatient) => curPatient.ID === scans[0]?.PID) ||
  patients.find((curPatient) => curPatient.ID === exams[0]?.PID);

const rightArr = document.querySelector(".fa-solidArrR");
const leftArr = document.querySelector(".fa-solidArrL");

if (!scans && !exams && !currPatient) {
  genereateHeader(currPatient);
} else {
  genereateHeader(currPatient);
  generateExams(exams);
  generateScans(scans);
}

scansContainer.addEventListener("click", handlePreview);

function genereateHeader(currPatient) {
  let html = "";
  if (currPatient) {
    html = `  <h2 class="margin-bottom--l border-bottom">
    Search results for ${currPatient.Name} with ID
    ${currPatient.ID}
    </h2>
    <h3 class="tertiary-heading margin-bottom--m">
    Examinations details
    </h3>
    `;
    scansContainer.classList.remove("hidden");
    examsContainer.classList.remove("hidden");
  }
  if (!currPatient) {
    html = `<h2 class="margin-top--l center-text">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"/></svg>    No search results for this patient!
    </h2>`;
    scansContainer.classList.add("hidden");
    examsContainer.classList.add("hidden");
  }
  form.insertAdjacentHTML("afterbegin", html);
}

function generateExams(data) {
  let html = "";
  if (!data) html = ``;
  else {
    data.forEach((exam) => {
      html += `
  <label class="label-date">${exam.Date}</label>
  <div class="exam">
    <label class="hidden"></label>
    <div class="flex-column">
      <div class="frame-row space-between">
        <div class="frame-row">
          <label>C/O:</label>
          <label class="bold">${handleCO(+exam.CO)}</label>
        </div>
        <div class="frame-row">
          <label>Ht:</label>
          <label class="bold">${handleHT([
            +exam.HT1,
            +exam.HT2,
            +exam.HT3,
          ])}</label>
        </div>
        <div class="frame-row">
          <label>Pulse:</label>
          <label class="bold">${exam.Pulse}/min ${
        +exam.PulseType === 1 ? "R" : "Irr"
      }</label>
        </div>
      </div>
      <div class="frame-row space-between">
        <div class="frame-row">
          <label>BP:</label>
          <label class="bold">S: ${exam.BPS} D:${exam.BPD}</label>
        </div>
        <div class="frame-row">
          <label>ABD:</label>
          <label class="bold">${exam.ABD}</label>
        </div>
        <div class="frame-row">
          <label>RR:</label>
          <label class="bold">${exam.RR}/min</label>
        </div>
      </div>
      <div class="frame-row space-between">
        <div class="frame-row">
          <label>LL:</label>
          <label class="bold">Pulse: ${+exam.LL === 1 ? "YES" : "NO"}</label>
        </div>
        <div class="frame-row">
          <label>Chest:</label>
          <label class="bold">${handleChest(+exam.Chest)}</label>
        </div>
        <div class="frame-row">
          <label>Oedema:</label>
          <label class="bold">${handleOedema(+exam.Oedema)}</label>
        </div>
      </div>
    </div>
  </div>

    `;
    });
  }

  examsContainer.insertAdjacentHTML("beforeend", html);
  examsContainer.insertAdjacentHTML(
    "afterend",
    '  <h3 class="tertiary-heading margin-bottom--m">Previous scans</h3>  '
  );
}

function generateScans(data) {
  let html = "";
  if (!data) html = ``;
  else {
    data.forEach((scan, i) => {
      html += `
        <label class="label-date"> ${scan.SDate} </label>
            <div class="scan" data-no="${i}">
              <div class="frame-row space-between align-center">
                <label class="hidden" ></label>
                <label>${countScans(scan)} scans</label>
                <a href="#">preview</a>
              </div>
            </div>
        `;
    });
  }
  scansContainer.insertAdjacentHTML("afterbegin", html);
}

function handleCO(num) {
  if (num === 1) return "Chest pain";
  if (num === 2) return "Dyspnea";
  if (num === 3) return "Palpitation";
  if (num === 4) return "LL Oedema";
}

function handleHT(arr) {
  let [HT1, HT2, comments] = arr;

  if (!HT1) HT1 = "";
  if (!HT2) HT2 = "";
  if (!comments) comments = "";
  else comments = "Others: " + comments;

  if (+HT1 === 1) HT1 = "S1";
  else if (+HT1 === 2) HT1 = "S2";
  else if (+HT1 === 3) HT1 = "S3";
  else if (+HT1 === 4) HT1 = "S4";

  if (+HT2 === 1) HT2 = " Sys. m";
  else if (+HT2 === 2) HT2 = " Dia. m";

  let arrFinal = [HT1, HT2, comments];
  arrFinal = arrFinal.filter((el) => Boolean(el));

  return arrFinal.join(", ");
}

function handleChest(num) {
  if (num === 1) return "HVB";
  if (num === 2) return "Rhonchi";
  if (num === 3) return "Crepitus";
}

function handleOedema(num) {
  if (num === 1) return "Mild";
  if (num === 2) return "Moderate";
  if (num === 3) return "Severe";
}

function countScans(scan) {
  let count = 0;
  for (const [key, value] of Object.entries(scan)) {
    if (key.startsWith("Image") && value) count++;
  }
  return count;
}

function generateModal(scan) {
  document.querySelector(".margin-0-auto .bold").textContent = scan.Comments;
  const imgsDiv = document.querySelector(".images-div");
  scansContainer.classList.add("no-pointer");
  examsContainer.classList.add("no-pointer");
  let i = 0;
  for (const [key, value] of Object.entries(scan)) {
    if (key.startsWith("Image") && Boolean(value)) {
      const div = document.createElement("div");
      div.style.backgroundImage = `url(data:image/png;base64,${
        key === "Image1" ? value.slice(2, -1) : value
      })`;
      div.classList.add("img-mod");
      div.setAttribute("data-imgNo", i + 1);
      imgsDiv.appendChild(div);
      let html;
      if (i === 0)
        html = `
            <svg class="fa-circle active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z"/></svg>
        
            `;
      else
        html = `
      <svg class="fa-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z"/></svg>
      `;
      document
        .querySelector(".dot-container")
        .insertAdjacentHTML("beforeend", html);
      i++;
    }
  }
}

function handlePreview(e) {
  e.preventDefault();
  if (e.target.tagName !== "A") return;
  const parentScan = e.target.closest(".scan");
  if (!parentScan) return;
  generateModal(scans[+parentScan.dataset.no]);
  document.getElementById("overlay").classList.add("is-visible");
  document.querySelector(".modal").classList.add("is-visible");
}

function closeModal() {
  document.getElementById("overlay").classList.remove("is-visible");
  document.querySelector(".modal").classList.remove("is-visible");
  document.querySelector(".dot-container").innerHTML = "";
  scansContainer.classList.remove("no-pointer");
  examsContainer.classList.remove("no-pointer");
}

rightArr.addEventListener("click", swipeRight);
leftArr.addEventListener("click", swipeLeft);

document.addEventListener("keydown", (e) => {
  if (
    e.code === "ArrowRight" &&
    document.querySelector(".modal").classList.contains("is-visible")
  )
    swipeRight();
  if (
    e.code === "ArrowLeft" &&
    document.querySelector(".modal").classList.contains("is-visible")
  )
    swipeLeft();
  if (
    e.code === "Escape" &&
    document.querySelector(".modal").classList.contains("is-visible")
  )
    closeModal();
});

document.getElementById("overlay").addEventListener("click", closeModal);
