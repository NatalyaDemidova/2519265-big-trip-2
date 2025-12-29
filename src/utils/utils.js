import dayjs from 'dayjs';
import { dateNow, MINUTES_IN_HOUR } from '../const.js';
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
  return (dateStart && (new Date(dateStart).getTime() <= dateNow.getTime()) && (dateEnd && (new Date(dateEnd).getTime() >= dateNow.getTime())));
}

export function isPointExpired(dateEnd) {
  return dateEnd && dayjs().isAfter(dayjs(dateEnd));
}

export function getTotalTime(date) {
  let minutes = '';
  let hours = '';
  let days = '';

  if (date >= MINUTES_IN_DAY) {
    days = Math.floor(date / MINUTES_IN_DAY);
    days = String(days).padStart(2, '0');
  }
  if (date >= MINUTES_IN_HOUR) {
    hours = Math.floor((date - days * MINUTES_IN_DAY) / MINUTES_IN_HOUR);
    hours = String(hours).padStart(2, '0');
  }
  minutes = date - ((days * MINUTES_IN_DAY) + (hours * MINUTES_IN_HOUR));
  minutes = String(minutes).padStart(2, '0');

  return (`${days > 0 ? ` ${days}D` : ''} ${hours}H ${minutes}M`);
}

