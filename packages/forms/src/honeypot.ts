/** True when the hidden honeypot field has any value (bots fill every input). */
export function isHoneypotTripped(form: FormData, field = 'website'): boolean {
  const v = form.get(field);
  if (v === null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  return true;
}
