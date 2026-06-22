import { create } from 'zustand';
import {
    fetchCourtsSchedule,
    updateCourtSchedule,
    fetchGlobalConfig,
    updateGlobalConfig,
    createBlockout,
    updateBlockout,
    deleteBlockout
} from '../services/scheduleService';




export const useScheduleStore = create((set, get) => ({
  courts: [],
  onlineStatus: true,
  publicBookingEnabled: true,
  globalOpenTime:'08:00 AM',
  globalCloseTime:'11:00 PM',
  hasUnsavedChanges: false,
  isLoading:false,
  error: null,
  
  loadSchedule: async (complexId) => {
        set({isLoading: true, error: null})
        try {
            const courtsResponse = await fetchCourtsSchedule(complexId)
            const globalResponse = await fetchGlobalConfig(complexId)

            const courtsData = courtsResponse.data || courtsResponse;
            const globalData = globalResponse.data || globalResponse;

            set({
                courts: courtsData,
                onlineStatus: globalData.onlineStatus ?? true,
                publicBookingEnabled: globalData.publicBookingEnabled ?? true,
                globalOpenTime: globalData.openTime || '08:00 AM',
                isLoading: false,
                hasUnsavedChangesfalse: false
            })
        } catch (error) {
            set({error: error.message || 'error al cargar datos', isLoading: false})
        }
  },

  
  updateCourtDay: (courtId, dayIndex, field, value) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.courtId !== courtId) return c;
      const newDays = [...c.days];
      newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
      return { ...c, days: newDays };
    }),
    hasUnsavedChanges: true
  })),


  toggleCourtActive: (courtId) => set((state) => ({
    courts: state.courts.map(c =>
      c.courts === courtId ? { ...c, active: !c.active } : c
    ),
    hasUnsavedChanges: true
  })),

  addBlockToCourt: (courtId, block) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.courtId !== courtId) return c;
      return { ...c, blocks: [...c.blocks, { ...block, id: 'temp_' + date.now()}] };
    }),
    hasUnsavedChanges: true
  })),

  
  updateBlockInCourt: (courtId, blockId, data) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.courts !== courtId) return c;
      return {
        ...c,
        blocks: c.blocks.map(b => b.id === blockId ? { ...b, ...data } : b)
      };
    }),
    hasUnsavedChanges: true
  })),

  deleteBlockFromCourt: (courtId, blockId) => set((state) => ({
    courts: state.courts.map(c => {
      if (c.courts !== courtId) return c;
      return { ...c, blocks: c.blocks.filter(b => b.id !== blockId) };
    }),
    hasUnsavedChanges: true
  })),
  setOnlineStatus: (value) => set({onlineStatus: value, hasUnsavedChanges: true}),
  setPublicBooking: (value) => set({publicBookingEnabled: value, hasUnsavedChanges: true}),

  
  saveChanges: async (complexId) => {
    set({isLoading: true, error: null})
    const state = get()
    try {
        await updateGlobalConfig(complexId, {
            onlineStatus: state.onlineStatus,
            publicBookingEnabled: state.publicBookingEnabled,
            openTime: state.globalOpenTime,
            closeTime: state.globalCloseTime
        })
        const courtPromises = state.courts.map(court =>
            updateCourtSchedule(court.courtId, {
                active: court.active,
                days: court.days
            })
        )
        await Promise.all(courtPromises)

        for (const court of state.courts) {
        for (const block of court.blocks) {
          if (block.id.startsWith('temp_')) {
            const newBlockResponse = await createBlockout({
              complexId,
              courtId: court.courtId,
              name: block.name,
              recurrence: block.recurrence,
              dayOfWeek: block.day || null,
              startTime: block.startTime,
              endTime: block.endTime
            });
            block.id = newBlockResponse.data?._id || newBlockResponse._id;
          } else {
            await updateBlockout(block.id, {
              name: block.name,
              recurrence: block.recurrence,
              dayOfWeek: block.day || null,
              startTime: block.startTime,
              endTime: block.endTime
            });
          }
        }
      }
      set({hasUnsavedChanges: false, isLoading: false})
    } catch (error) {
        set({error: error.message || 'Error al guardar cambios', isLoading: false })
    }
  },

  
  discardChanges: async (complexId) => {
    set({ isLoading: true });
    await get().loadSchedule(complexId);
    set({ isLoading: false });
  }
}));