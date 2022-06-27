export default async function getPatients() {
  const patientDataP = await fetch("/static/json_patients.json");
  const patientDataJson = await patientDataP.json();
  return patientDataJson;
}
