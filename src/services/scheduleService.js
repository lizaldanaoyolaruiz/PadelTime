import api from "./axios"

export const fetchCourtsSchedule = (complexId) =>{
    api.get('/courts/schedule', {params: {complexId}  })
}

export const updateCourtSchedule = (courtId, data) => {
  api.put(`/courts/${courtId}/schema`, data)
}

export const fetchGlobalConfig = (complexId) => {
  api.get(`/complex/${complexId}/config`)
}

export const updateGlobalConfig = (complexId, data) =>{
    api.put(`/complex/${complexId}/config`, data)
}

export const createBlockout = (blockdata) => {
    api.post('/blockouts', blockdata)
}

export const updateBlockout = (blockId, data) => {
    api.put(`/blockouts/${blockId}`, data)
}

export const deleteBlockout = (blockId) => {
    api.delete(`/blockouts/${blockId}`)
}