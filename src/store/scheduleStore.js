import { create } from 'zustand';

const defaultCourts = [
  {
    id: '1',
    name: 'Caché 1 - Pro',
    days: [
      { day: 'lunes', openTime: '08:00 AM', closeTime: '11:00 PM', active: true },
      { day: 'martes', openTime: '08:00 AM', closeTime: '11:00 PM', active: true },
      { day: 'domingo', openTime: '08:00 AM', closeTime: '11:00 PM', active: false }
    ],
    blocks: [
      { id: 'b1', name: 'Siesta Técnica', recurrence: 'daily', day: null, startTime: '02:00 PM', endTime: '04:00 PM' }
    ]
  },
  {
    id: '2',
    name: 'Caché 2 - VIP',
    days: [
      { day: 'lunes', openTime: '08:00 AM', closeTime: '11:00 PM', active: true },
      { day: 'martes', openTime: '08:00 AM', closeTime: '11:00 PM', active: true },
      { day: 'domingo', openTime: '08:00 AM', closeTime: '11:00 PM', active: true }
    ],
    blocks: [
      { id: 'b2', name: 'Siesta Técnica', recurrence: 'daily', day: null, startTime: '02:00 PM', endTime: '04:00 PM' }
    ]
  },
  {
    id: '3',
    name: 'Caché 3 - Panorámica',
    days: [
      { day: 'lunes', openTime: '08:00 AM', closeTime: '11:00 PM', active: true },
      { day: 'martes', openTime: '08:00 AM', closeTime: '11:00 PM', active: false },
      { day: 'domingo', openTime: '08:00 AM', closeTime: '11:00 PM', active: false }
    ],
    blocks: [
      { id: 'b3', name: 'Limpieza General', recurrence: 'weekly', day: 'sábado', startTime: '07:00 AM', endTime: '08:30 AM' }
    ]
  },
  {
    id: '4',
    name: 'Caché 4 - Standard',
    days: [
      { day: 'lunes', openTime: '10:00 AM', closeTime: '10:00 PM', active: true },
      { day: 'martes', openTime: '10:00 AM', closeTime: '10:00 PM', active: true },
      { day: 'domingo', openTime: '10:00 AM', closeTime: '08:00 PM', active: true }
    ],
    blocks: []
  }
];

export const useScheduleStore = create((set) => ({
  courts: defaultCourts,
  hasUnsavedChanges: false,
  savedSnapshot: null,
  updateCourt: (courtId, newData) => set((state) => ({
    courts: state.courts.map(c => c.id === courtId ? { ...c, ...newData } : c),
    hasUnsavedChanges: true
  })),

  updateCourtDay: (courtId, dayIndex, field, value) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.id !== courtId) return c;
      const newDays = [...c.days];
      newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
      return { ...c, days: newDays };
    }),
    hasUnsavedChanges: true
  })),

  addBlockToCourt: (courtId, block) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.id !== courtId) return c;
      return { ...c, blocks: [...c.blocks, { ...block, id: Date.now().toString() }] };
    }),
    hasUnsavedChanges: true
  })),

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

  deleteBlockFromCourt: (courtId, blockId) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.id !== courtId) return c;
      return { ...c, blocks: c.blocks.filter(b => b.id !== blockId) };
    }),
    hasUnsavedChanges: true
  })),

  
  saveChanges: () => set((state) => ({
    savedSnapshot: JSON.stringify(state.courts),
    hasUnsavedChanges: false
  })),

  discardChanges: () => set((state) => {
    if (!state.savedSnapshot) return state;
    const courts = JSON.parse(state.savedSnapshot);
    return { courts, hasUnsavedChanges: false };
  })
}));