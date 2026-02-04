import dayjs from 'dayjs';
import { MINUTES_IN_HOUR } from '../const.js';
import { MINUTES_IN_DAY } from '../const.js';

export default function humanizedueDate(dueDate, DAY_FORMAT) {
  return dueDate ? dayjs(dueDate).format(DAY_FORMAT) : '';
}

export function differentTime(dateStart, dateEnd) {
  return dayjs(dateEnd).diff(dayjs(dateStart), 'minute');
}

export function getDateWithTime(date, time) {
  const space = '&nbsp;';
  if((!date) && (!time)) {
    return '';
  }

  return date + space + time;
}

export function isPointFuture(dateStart) {
  return dateStart && dayjs().isBefore(dayjs(dateStart));
}

export function isPointExpiringToday(dateStart, dateEnd) {
  const isDateStartCoorrect = dateStart && (new Date(dateStart).getTime() <= new Date().getTime());
  const isDateEndCorrect = (dateEnd && (new Date(dateEnd).getTime() >= new Date().getTime()));
  return isDateStartCoorrect && isDateEndCorrect;
}

export function isPointExpired(dateEnd) {
  return dateEnd && dayjs().isAfter(dayjs(dateEnd));
}

export function getTotalTime(date) {
  let minutes = 0;
  let hours = 0;
  let days = 0;

  if (date >= MINUTES_IN_DAY) {
    days = Math.floor(date / MINUTES_IN_DAY);
    date = date - (days * MINUTES_IN_DAY);
  }
  if (date >= MINUTES_IN_HOUR) {
    hours = Math.floor(date / MINUTES_IN_HOUR);
    date = date - (hours * MINUTES_IN_HOUR);
  }
  minutes = date;

  days = String(days).padStart(2, '0');
  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');

  if (days > 0) {
    return (`${days}d ${hours}h ${minutes}m`);
  } else if (hours > 0) {
    return (`${hours}h ${minutes}m`);
  }
  return `${minutes}m`;
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
