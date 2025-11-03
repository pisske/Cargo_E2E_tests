export function generateValidAWB() {
  const prefix = "000"; // fixed airline prefix

  // Generate 7-digit serial number
  const serialNumber = Math.floor(Math.random() * 9000000) + 1000000;

  // Check digit = last digit of (serialNumber % 7)
  const checkDigit = serialNumber % 7;

  // Full AWB: prefix + serial + check digit
  const awb = `${prefix}${serialNumber}${checkDigit}`;

  return awb;
}
