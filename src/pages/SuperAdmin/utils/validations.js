// ── Teclas de navegación permitidas en todos los inputs ───────────────────────
const NAV_KEYS = [
  'Backspace', 'Delete', 'Tab',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End',
];
const isCtrl = (e) => e.ctrlKey || e.metaKey || e.altKey;

// ── Bloqueadores de teclado (UX: previene caracteres inválidos en tiempo real) ─

/** Solo letras (incluye acentos), espacios, guión, apóstrofe y punto */
export function blockNonLetters(e) {
  if (isCtrl(e) || NAV_KEYS.includes(e.key)) return;
  if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-.]$/.test(e.key)) return;
  e.preventDefault();
}

/** Solo dígitos, +, guión, espacios y paréntesis (teléfono) */
export function blockNonPhone(e) {
  if (isCtrl(e) || NAV_KEYS.includes(e.key)) return;
  if (/^[0-9+\-\s()]$/.test(e.key)) return;
  e.preventDefault();
}

/** Solo dígitos enteros (pistas) */
export function blockNonDigits(e) {
  if (isCtrl(e) || NAV_KEYS.includes(e.key)) return;
  if (/^[0-9]$/.test(e.key)) return;
  e.preventDefault();
}
