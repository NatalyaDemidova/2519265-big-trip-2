export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',

};

export const TimeLimitBlock = {
  LIMIT_LOWER: 350,
  LIMIT_UPPER: 1000,
};

export const DAY_FORMAT = {
  getMonthDay: 'MMM D',
  getDayAndMonth: 'D MMM',
  getTime: 'HH:mm',
  getDateWithSlash: 'DD/MM/YY',
  getDateForDataTime: 'YYYY-MM-DD',
  getDateAndTimeForDataTime: 'YYYY-MM-DD[T]HH:mm',

};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const MINUTES_IN_HOUR = 60;

export const MINUTES_IN_DAY = 1440;

export const sorts = [
  {name: 'day'},
  {name: 'event'},
  {name: 'time'},
  {name: 'price'},
  {name: 'offer'}
];

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const PriceRangeForPoint = {
  MIN_PRICE : 1,
  MAX_PRICE: 1000000,
};
