import AbstractView from '../framework/view/abstract-view';

function getFirstPoint() {

}

getFirstPoint()

function createTripInfoTemplate(points, offers) {

  const offersAll = offers.map(({type, offersOfType}) => offersOfType);

  console.log(offers)
  return (
    `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

              <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
            </p>
          </section>`
  );
}

export default class TripInfoView extends AbstractView {

  #pointsModel = null;

  constructor({pointsModel}) {
    super();
    this.#pointsModel = pointsModel;
  }

  get points() {
    return this.#pointsModel.points;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get template() {
    console.log(this.#pointsModel.offers)
    return createTripInfoTemplate(this.points, this.offers);
  }
}
