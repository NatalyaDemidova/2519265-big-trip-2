import { DAY_FORMAT } from '../const';
import AbstractView from '../framework/view/abstract-view';
import humanizedueDate, { sortDayOfPointDown, sortDayOfPointUp } from '../utils/utils';

const MAX_COUNT_POINTS = 3;

function getTotalPrice(points, offersAll) {

  let currentOffers = 0;

  const offersOfPoints = points.map(({ offers }) => [...offers]).flat();

  for (const offer of offersOfPoints) {
    const findOffer = offersAll.flatMap((elem) => elem.offers.find((item) => item.id === offer)).filter(Boolean);
    const [{price}] = findOffer;

    currentOffers += price;
  }


  const amountOfPoint = points.map((point) => point.basePrice)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return currentOffers + amountOfPoint;
}

function getTitleOfPoint(points, offersAll, destinations, firstPoint, lastPoint) {

  let pointsTitles = null;

  if ((points.length > 0) && (points.length <= MAX_COUNT_POINTS)) {
    pointsTitles = points.map(({ destination }) => destinations.map((elem) => (elem.id === destination) ? elem.name : ''))
      .flat()
      .filter((s) => s !== '');
    return pointsTitles ? pointsTitles.join(' &mdash; ') : '';
  }

  if (points.length > MAX_COUNT_POINTS) {
    const firstPointTitle = destinations.find((item) => firstPoint.destination === item.id).name;
    const lastPointTitle = destinations.find((item) => lastPoint.destination === item.id).name;

    return `${firstPointTitle} ... ${lastPointTitle}`;
  }
}

function getDateOfPoint(firstPoint, lastPoint) {
  if (firstPoint) {
    const firstPointDate = humanizedueDate(firstPoint.dateFrom, DAY_FORMAT.getDayAndMonth) || '';
    const lastPointDate = humanizedueDate(lastPoint.dateTo, DAY_FORMAT.getDayAndMonth) || '';

    return `${firstPointDate}&nbsp;&mdash;&nbsp; ${lastPointDate}`;
  }

}


function createTripInfoTemplate(points, offersAll, destinations) {

  if (!points.length || !offersAll.length || !destinations.length) {
    return;
  }

  const firstPoint = points.sort(sortDayOfPointUp)[0];

  const lastPoint = points.sort(sortDayOfPointDown)[0];

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getTitleOfPoint(points, offersAll, destinations, firstPoint, lastPoint)}</h1>

        <p class="trip-info__dates">${getDateOfPoint(firstPoint, lastPoint)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(points, offersAll)}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {

  #points = null;
  #offers = null;
  #destinations = null;

  constructor({ points, offers, destinations }) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#offers, this.#destinations);
  }
}
