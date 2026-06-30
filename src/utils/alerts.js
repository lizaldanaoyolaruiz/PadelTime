import Swal from "sweetalert2";

const baseConfig = {
  background: "#1f2937",
  color: "#ffffff",
  confirmButtonColor: "#a3e635",
  cancelButtonColor: "#374151",
};

export const confirmDelete = (texto = "Se eliminará permanentemente.") =>
  Swal.fire({
    ...baseConfig,
    title: "¿Eliminar?",
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

export const confirmDisable = () =>
  Swal.fire({
    ...baseConfig,
    title: "¿Deshabilitar cancha?",
    text: "No aparecerá en el portal público.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, deshabilitar",
    cancelButtonText: "Cancelar",
  });

export const confirmSave = () =>
  Swal.fire({
    ...baseConfig,
    title: "¿Guardar cambios?",
    text: "Se actualizarán los datos.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  });

export const confirmLogout = () =>
  Swal.fire({
    ...baseConfig,
    title: "¿Cerrar sesión?",
    text: "Tendrás que volver a iniciar sesión.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
  });

export const successAlert = (texto = "Acción completada correctamente.") =>
  Swal.fire({
    ...baseConfig,
    title: "¡Listo!",
    text: texto,
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
  });

export const errorAlert = (texto = "Ocurrió un error. Intentá de nuevo.") =>
  Swal.fire({
    ...baseConfig,
    title: "Error",
    text: texto,
    icon: "error",
    confirmButtonText: "Cerrar",
  });
