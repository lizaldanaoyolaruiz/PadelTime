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


export const getWeeklyHoursForCourt = (court) => {
  if (!court.active || !court.days || court.days.length === 0) return 0;
  let totalMinutes = 0;
  court.days.forEach(day => {
    if (!day.active) return;
    const openMin = parseTimeToMinutes(day.openTime);
    const closeMin = parseTimeToMinutes(day.closeTime);
    const dailyMinutes = closeMin - openMin;
    if (dailyMinutes > 0) totalMinutes += dailyMinutes;
  });
  return totalMinutes / 60;
};

export const getBlockedHoursForCourt = (court) => {
  if (!court.active || !court.blocks || court.blocks.length === 0) return 0;
  const activeDays = court.days.filter(d => d.active).map(d => d.day);
  if (activeDays.length === 0) return 0;
  let totalBlockedMinutes = 0;
  court.blocks.forEach(block => {
    const start = parseTimeToMinutes(block.startTime);
    const end = parseTimeToMinutes(block.endTime);
    const duration = end - start;
    if (duration <= 0) return;
    if (block.recurrence === 'Diario') {
      totalBlockedMinutes += duration * activeDays.length;
    } else if (block.recurrence === 'Semanal' && block.day) {
      if (activeDays.includes(block.day.toLowerCase())) {
        totalBlockedMinutes += duration;
      }
    }
  });
  return totalBlockedMinutes / 60;
};


export const getGlobalMetrics = (courts) => {
  let totalHours = 0;
  let totalBlocked = 0;
  courts.forEach(court => {
    totalHours += getWeeklyHoursForCourt(court);
    totalBlocked += getBlockedHoursForCourt(court);
  });
  const efficiency = totalHours > 0 ? ((totalHours - totalBlocked) / totalHours) * 100 : 0;
  return { totalHours, totalBlocked, efficiency };
};