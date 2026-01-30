import dayjs from 'dayjs';
import { dateNow, MINUTES_IN_HOUR, MINUTES_IN_YEARS } from '../const.js';
import { MINUTES_IN_DAY } from '../const.js';

export const getRundomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export default function humanizedueDate(dueDate, DAY_FORMAT) {
  return dueDate ? dayjs(dueDate).format(DAY_FORMAT) : '';
}

export function differentTime(dateStart, dateEnd) {
  return dayjs(dateEnd).diff(dayjs(dateStart), 'minute');
}

export function getDateWithTime(date, time) {
  const space = '&nbsp;';

  return date + space + time;
}

export function isPointFuture(dateStart) {
  return dateStart && dayjs().isBefore(dayjs(dateStart));
}

export function isPointExpiringToday(dateStart, dateEnd) {
  const isDateStartCoorrect = dateStart && (new Date(dateStart).getTime() <= dateNow.getTime());
  const isDateEndCorrect = (dateEnd && (new Date(dateEnd).getTime() >= dateNow.getTime()));
  return isDateStartCoorrect && isDateEndCorrect;
}

export function isPointExpired(dateEnd) {
  return dateEnd && dayjs().isAfter(dayjs(dateEnd));
}

export function getTotalTime(date) {
  let minutes = '';
  let hours = '';
  let days = '';
  let years = '';

  if (date >= MINUTES_IN_DAY) {
    years = Math.floor(date / MINUTES_IN_YEARS);
    years = String(years).padStart(2, '0');
    date = date - (years * MINUTES_IN_YEARS);
  }
  if (date >= MINUTES_IN_DAY) {
    days = Math.floor(date / MINUTES_IN_DAY);
    days = String(days).padStart(2, '0');
    date = date - (days * MINUTES_IN_DAY);
  }
  if (date >= MINUTES_IN_HOUR) {
    hours = Math.floor(date / MINUTES_IN_HOUR);
    hours = String(hours).padStart(2, '0');
    date = date - (hours * MINUTES_IN_HOUR);
  }
  minutes = date;
  minutes = String(minutes).padStart(2, '0');

  return (`${years > 0 ? ` ${years}Y` : ''} ${days > 0 ? ` ${days}D` : ''} ${hours > 0 ? ` ${hours}H` : ''} ${minutes}M`);
}

export function sortDurationOfPointUp(pointA, pointB) {

  const pointAFullTime = differentTime(pointA.dateFrom, pointA.dateTo);
  const pointBFullTime = differentTime(pointB.dateFrom, pointB.dateTo);

  return (pointBFullTime - pointAFullTime);
}

export function sortPriceDown(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export function isDateEqual(dateA, dateB) {
  return ((dateA === null && dateB === null) || dayjs(dateA).isSame(dateB));
}

export function sortDayOfPointUp(pointA, pointB) {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
}

export function sortDayOfPointDown(pointA, pointB) {
  return new Date(pointB.dateTo) - new Date(pointA.dateTo);
}
