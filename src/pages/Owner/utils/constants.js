export const SUPERFICIES = [
  { value: 'crystal',   label: 'Cristal' },
  { value: 'panoramic', label: 'Panorámica' },
];

export const SLOTS_INICIO  = '08:00';
export const SLOTS_FIN     = '22:00';
export const SLOT_DURACION = 60;

export function generarSlots(inicio = SLOTS_INICIO, fin = SLOTS_FIN) {
  const slots = [];
  const [hI, mI] = inicio.split(':').map(Number);
  const [hF, mF] = fin.split(':').map(Number);
  let total = hI * 60 + mI;
  const limite = hF * 60 + mF;
  while (total < limite) {
    const h = String(Math.floor(total / 60)).padStart(2, '0');
    const m = String(total % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
    total += SLOT_DURACION;
  }
  return slots;
}
