export type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; error: string };

/**
 * Phase 1 requires name and location to be strings with no digits.
 * Same rules for both fields, so one function covers it.
 */
export function validateTextField(
  raw: string,
  fieldLabel: string
): ValidationResult {
  const value = raw.trim();

  if (value.length === 0) {
    return { valid: false, error: `Please enter your ${fieldLabel}.` };
  }

  if (/\d/.test(value)) {
    return { valid: false, error: `${fieldLabel} cannot contain numbers.` };
  }

  // Letters, spaces, hyphens, apostrophes, periods.
  // Covers "O'Brien", "Jean-Luc", "St. Louis".
  if (!/^[\p{L}\s'.-]+$/u.test(value)) {
    return { valid: false, error: `Please enter a valid ${fieldLabel}.` };
  }

  return { valid: true, value };
}