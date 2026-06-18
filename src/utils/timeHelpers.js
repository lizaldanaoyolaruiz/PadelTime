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

export const getBaseWeeklyHours = (dayConfig) => {
  const days = ['lunes', 'martes', 'domingo'];
  const totalMinutes = days.reduce((acc, day) => {
    const config = dayConfig[day];
    if (!config || !config.active) return acc;
    const openMin = parseTimeToMinutes(config.openTime);
    const closeMin = parseTimeToMinutes(config.closeTime);
    const dailyMinutes = closeMin - openMin;
    return dailyMinutes > 0 ? acc + dailyMinutes : acc;
  }, 0);
  return totalMinutes / 60;
};

export const getBlockedHoursPerWeek = (blockouts, dayConfig) => {
  const activeDays = ['lunes', 'martes', 'domingo']
    .filter(day => dayConfig[day]?.active === true);

  if (activeDays.length === 0) return 0;

  const totalBlockedMinutes = blockouts.reduce((acc, block) => {
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