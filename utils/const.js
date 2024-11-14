function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

let DEFAULT_MEDICINE = null;

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

module.exports = {
  formatDate,
  timeSlots,
  DEFAULT_MEDICINE,
  setDefaultMedicineUrl: (url) => {
    DEFAULT_MEDICINE = url;
  },
};
