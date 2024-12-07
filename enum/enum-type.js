const EnumType = {
  BASIC_INFO: "BASIC_INFO",
  HEART_ULTRASOUND: "HEART_ULTRASOUND",
  PRESCRIPTION: "PRESCRIPTION",
};

function isValidType(type) {
  return Object.values(EnumType).includes(type);
}

module.exports = { EnumType, isValidType };
