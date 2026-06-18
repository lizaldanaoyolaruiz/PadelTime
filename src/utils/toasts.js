import Swal from '../utils/alerts.js';

const baseToast = {
  background: '#1f2937',
  color: '#ffffff',
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
};

export const toastSuccess = (texto) =>
  Swal.fire({ ...baseToast, icon: 'success', title: texto });

export const toastError = (texto) =>
  Swal.fire({ ...baseToast, icon: 'error', title: texto });

export const toastWarning = (texto) =>
  Swal.fire({ ...baseToast, icon: 'warning', title: texto });
