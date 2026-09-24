const IRAN_MOBILE_REGEX = /^09\d{9}$/;

/** just local format 09xxxxxxxxx */
export function isValidIranPhone(phone: string): boolean {
  return IRAN_MOBILE_REGEX.test(phone);
}

/** 09102345678 -> +989102345678 */
export function toE164(phone: string): string {
  if (!isValidIranPhone(phone)) {
    throw new Error("Invalid Iranian phone number format");
  }
  return `+98${phone.slice(1)}`;
}

/** is It iran number !? +98 E.164 */
export function isValidE164IranPhone(phone: string): boolean {
  return /^\+989\d{9}$/.test(phone);
}
