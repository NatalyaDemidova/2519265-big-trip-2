import { remove, render, RenderPosition, replace } from '../framework/render';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #pointsModel = null;
  #container = null;

  #tripInfoComponent = null;

  constructor({ mainContainer, pointsModel }) {
    this.#container = mainContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);

  }


  init() {

    const prevTripInfoComponent = this.#tripInfoComponent;


    if (!this.points.length || !this.offers.length || !this.destinations.length) {
      if (prevTripInfoComponent) {
        remove(prevTripInfoComponent);

      }
      return;
    }
    if (this.points.length <= 0) {
      remove(prevTripInfoComponent);

      return;
    }

    this.#tripInfoComponent = new TripInfoView({
      points: this.points,
      offers: this.offers,
      destinations: this.destinations,
    });

    if (this.points.length <= 0) {
      remove(prevTripInfoComponent);
    }

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);

  }

  get points() {
    return this.#pointsModel.points;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  #handleModelEvent = () => {
    this.init();
  };
}
