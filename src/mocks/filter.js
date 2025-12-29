import { filter } from '../utils/filter.js';

export function generateFilter(points) {
  return Object.entries(filter).map(
    ([FilterType, filterPoints]) => ({
      type: FilterType,
      count: filterPoints(points).length,
    }),
  );
}
