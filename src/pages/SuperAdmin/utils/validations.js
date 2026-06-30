const NAV_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
];
const isCtrl = (e) => e.ctrlKey || e.metaKey || e.altKey;

export function blockNonLetters(e) {
  if (isCtrl(e) || NAV_KEYS.includes(e.key)) return;
  if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-.]$/.test(e.key)) return;
  e.preventDefault();
}

export function blockNonPhone(e) {
  if (isCtrl(e) || NAV_KEYS.includes(e.key)) return;
  if (/^[0-9+\-\s()]$/.test(e.key)) return;
  e.preventDefault();
}

export function blockNonDigits(e) {
  if (isCtrl(e) || NAV_KEYS.includes(e.key)) return;
  if (/^[0-9]$/.test(e.key)) return;
  e.preventDefault();
}
