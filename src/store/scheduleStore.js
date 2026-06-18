import { create } from 'zustand';
import { getBaseWeeklyHours, getBlockedHoursPerWeek } from '../utils/timeHelpers';

const defaultDayConfig = {
  lunes: { openTime: '08:00 AM', closeTime: '11:00 PM', active: true },
  martes: { openTime: '08:00 AM', closeTime: '11:00 PM', active: true },
  domingo: { openTime: '08:00 AM', closeTime: '11:00 PM', active: false },
};

const getStateSnapshot = (state) => ({
  onlineStatus: state.onlineStatus,
  publicBookingEnabled: state.publicBookingEnabled,
  dayConfig: {
    lunes: { ...state.dayConfig.lunes },
    martes: { ...state.dayConfig.martes },
    domingo: { ...state.dayConfig.domingo },
  },
  blocks: state.blocks.map(b => ({ ...b })),
});

export const useScheduleStore = create((set, get) => {
  const initialState = {
    onlineStatus: true,
    publicBookingEnabled: true,
    dayConfig: defaultDayConfig,
    blocks: [
      { id: '1', name: 'Siesta Técnica', recurrence: 'daily', day: null, startTime: '02:00 PM', endTime: '04:00 PM' },
      { id: '2', name: 'Limpieza General', recurrence: 'weekly', day: 'sábado', startTime: '07:00 AM', endTime: '08:30 AM' }
    ],
    hasUnsavedChanges: false,
    savedSnapshot: null,
  };

  initialState.savedSnapshot = getStateSnapshot(initialState);

  return {
    ...initialState,

    setOnlineStatus: (val) => set({ onlineStatus: val, hasUnsavedChanges: true }),
    setPublicBooking: (val) => set({ publicBookingEnabled: val, hasUnsavedChanges: true }),

    updateDayConfig: (day, field, value) => set((state) => ({
      dayConfig: {
        ...state.dayConfig,
        [day]: { ...state.dayConfig[day], [field]: value }
      },
      hasUnsavedChanges: true
    })),

    addBlock: (block) => set((state) => ({
      blocks: [...state.blocks, { ...block, id: Date.now().toString() }],
      hasUnsavedChanges: true
    })),

    updateBlock: (id, data) => set((state) => ({
      blocks: state.blocks.map(b => b.id === id ? { ...b, ...data } : b),
      hasUnsavedChanges: true
    })),

    deleteBlock: (id) => set((state) => ({
      blocks: state.blocks.filter(b => b.id !== id),
      hasUnsavedChanges: true
    })),

    saveChanges: () => set((state) => ({
      savedSnapshot: getStateSnapshot(state),
      hasUnsavedChanges: false
    })),

    discardChanges: () => set((state) => {
      if (!state.savedSnapshot) return state;
      const snap = state.savedSnapshot;
      return {
        ...state,
        onlineStatus: snap.onlineStatus,
        publicBookingEnabled: snap.publicBookingEnabled,
        dayConfig: {
          lunes: { ...snap.dayConfig.lunes },
          martes: { ...snap.dayConfig.martes },
          domingo: { ...snap.dayConfig.domingo },
        },
        blocks: snap.blocks.map(b => ({ ...b })),
        hasUnsavedChanges: false
      };
    })
  };
});