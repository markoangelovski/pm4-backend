import { BadRequestException } from '@nestjs/common';

export const makeDate = (value: string) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new BadRequestException('Invalid date format');
  }
  date.setUTCHours(0, 0, 0, 0); // Clear time portion
  return date;
};

export function getHourWithFraction(date: Date): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine fractional part of the hour
  let fractionalHour: number;
  if (minutes >= 0 && minutes <= 7) {
    fractionalHour = 0;
  } else if (minutes >= 8 && minutes <= 22) {
    fractionalHour = 0.25;
  } else if (minutes >= 23 && minutes <= 37) {
    fractionalHour = 0.5;
  } else if (minutes >= 38 && minutes <= 52) {
    fractionalHour = 0.75;
  } else {
    // Minutes from 53 to 59.99, add one to the hour
    fractionalHour = 0;
    return (hours + 1) % 24;
  }

  // Return the hour as a floating number
  return +(hours + fractionalHour).toFixed(2);
}
