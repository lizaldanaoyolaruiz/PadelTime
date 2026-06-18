// src/store/scheduleStore.js
import { create } from 'zustand';

// Días de la semana (Lunes a Domingo)
const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

// Configuración por defecto para cada cancha
const defaultCourts = [
  {
    id: '1',
    name: 'Cantina 1 - Pro',
    active: true,
    days: daysOfWeek.map(day => ({
      day,
      openTime: '08:00 AM',
      closeTime: '11:00 PM',
      active: true
    })),
    blocks: [
      { id: 'b1', name: 'Siesta Técnica', recurrence: 'Diario', day: null, startTime: '02:00 PM', endTime: '04:00 PM' }
    ]
  },
  {
    id: '2',
    name: 'Cantina 2 - VIP',
    active: true,
    days: daysOfWeek.map(day => ({
      day,
      openTime: '08:00 AM',
      closeTime: '11:00 PM',
      active: true
    })),
    blocks: [
      { id: 'b2', name: 'Limpieza General', recurrence: 'Semanal', day: 'sábado', startTime: '07:00 AM', endTime: '08:30 AM' }
    ]
  },
  {
    id: '3',
    name: 'Cantina 3 - Panorámica',
    active: false,
    days: daysOfWeek.map(day => ({
      day,
      openTime: '08:00 AM',
      closeTime: '11:00 PM',
      active: day !== 'domingo' // Domingo inactivo
    })),
    blocks: []
  },
  {
    id: '4',
    name: 'Cantina 4 - Standard',
    active: true,
    days: daysOfWeek.map(day => ({
      day,
      openTime: '10:00 AM',
      closeTime: '10:00 PM',
      active: true
    })),
    blocks: []
  }
];

export const useScheduleStore = create((set) => ({
  courts: defaultCourts,
  hasUnsavedChanges: false,
  savedSnapshot: null,

  // Actualizar un campo de un día específico de una cancha
  updateCourtDay: (courtId, dayIndex, field, value) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.id !== courtId) return c;
      const newDays = [...c.days];
      newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
      return { ...c, days: newDays };
    }),
    hasUnsavedChanges: true
  })),

  // Actualizar estado activo de la cancha
  toggleCourtActive: (courtId) => set((state) => ({
    courts: state.courts.map(c =>
      c.id === courtId ? { ...c, active: !c.active } : c
    ),
    hasUnsavedChanges: true
  })),

  // Agregar bloqueo a una cancha
  addBlockToCourt: (courtId, block) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.id !== courtId) return c;
      return { ...c, blocks: [...c.blocks, { ...block, id: Date.now().toString() }] };
    }),
    hasUnsavedChanges: true
  })),

  // Actualizar bloqueo
  updateBlockInCourt: (courtId, blockId, data) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.id !== courtId) return c;
      return {
        ...c,
        blocks: c.blocks.map(b => b.id === blockId ? { ...b, ...data } : b)
      };
    }),
    hasUnsavedChanges: true
  })),

  // Eliminar bloqueo
  deleteBlockFromCourt: (courtId, blockId) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.id !== courtId) return c;
      return { ...c, blocks: c.blocks.filter(b => b.id !== blockId) };
    }),
    hasUnsavedChanges: true
  })),

  // Guardar cambios
  saveChanges: () => set((state) => ({
    savedSnapshot: JSON.stringify(state.courts),
    hasUnsavedChanges: false
  })),

  // Descartar cambios
  discardChanges: () => set((state) => {
    if (!state.savedSnapshot) return state;
    return {
      courts: JSON.parse(state.savedSnapshot),
      hasUnsavedChanges: false
    };
  })
}));