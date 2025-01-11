export const makeDate = (value: string) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  date.setUTCHours(0, 0, 0, 0); // Clear time portion
  return date;
};
