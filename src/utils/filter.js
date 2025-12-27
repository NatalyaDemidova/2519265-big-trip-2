import { FilterType } from '../const.js';
import { isPointExpired, isPointExpiringToday, isPointFuture } from './utils';
// import { points } from './mocks/points';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter(() => points.length > 0),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointExpiringToday(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.dateFrom)),
};
