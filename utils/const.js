function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function generateTimestampString() {
  const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

let DEFAULT_MEDICINE = {
  value: undefined,
};

const timeSlots = [
  "07:00:00",
  "07:30:00",
  "08:00:00",
  "08:30:00",
  "09:00:00",
  "09:30:00",
  "10:00:00",
  "10:30:00",
  "11:00:00",
  "11:30:00",
  "12:00:00",
  "12:30:00",
  "13:00:00",
  "13:30:00",
  "14:00:00",
  "14:30:00",
  "15:00:00",
];

function setDefaultMedicineUrl(url) {
  DEFAULT_MEDICINE.value = url;
}

module.exports = {
  formatDate,
  timeSlots,
  DEFAULT_MEDICINE,
  setDefaultMedicineUrl,
  generateTimestampString,
};
