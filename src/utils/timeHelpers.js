export const parseTimeToMinutes = (timeStr) => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const modifier = match[3].toUpperCase();
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Calcula horas semanales para una cancha (basado en sus días activos)
export const getWeeklyHoursForCourt = (court) => {
  if (!court.days || court.days.length === 0) return 0;
  const totalMinutes = court.days.reduce((acc, day) => {
    if (!day.active) return acc;
    const openMin = parseTimeToMinutes(day.openTime);
    const closeMin = parseTimeToMinutes(day.closeTime);
    const dailyMinutes = closeMin - openMin;
    return dailyMinutes > 0 ? acc + dailyMinutes : acc;
  }, 0);
  return totalMinutes / 60;
};

// Calcula horas bloqueadas por semana para una cancha
export const getBlockedHoursForCourt = (court) => {
  if (!court.blocks || court.blocks.length === 0) return 0;
  const activeDays = court.days.filter(d => d.active).map(d => d.day);
  if (activeDays.length === 0) return 0;

  const totalBlockedMinutes = court.blocks.reduce((acc, block) => {
    const start = parseTimeToMinutes(block.startTime);
    const end = parseTimeToMinutes(block.endTime);
    const durationMinutes = end - start;
    if (durationMinutes <= 0) return acc;

    if (block.recurrence === 'daily') {
      return acc + durationMinutes * activeDays.length;
    } else if (block.recurrence === 'weekly' && block.day) {
      if (activeDays.includes(block.day.toLowerCase())) {
        return acc + durationMinutes;
      }
    }
    return acc;
  }, 0);
  return totalBlockedMinutes / 60;
};