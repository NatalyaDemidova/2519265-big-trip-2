import { render, replace } from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import EditPointView from '../view/edit-point-view.js';
import TripPointView from '../view/trip-point-view.js';
import NoPointsView from '../view/no-point-view.js';
// import { getRundomArrayElement } from '../utils.js';

export default class BoardPresenter {
  #pointsModel = null;
  #boardContainer = null;

  #tripPointsList = new TripPointsListView();

  #boardPoints = [];
  #pointOffers = [];
  #boardDestinations = [];
  #boardOffers = [];
  #destinationOfPoint = null;

  constructor({ boardContainer }, pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardContainer = boardContainer;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestinations = [...this.#pointsModel.destinations];

    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#boardPoints.length > 0) {
      render(new SortView(), this.#boardContainer);
      render(this.#tripPointsList, this.#boardContainer);

      for (let i = 1; i < this.#boardPoints.length; i++) {
        this.#renderPoint(this.#boardPoints[i]);
      }
    } else {
      render(new NoPointsView, this.#boardContainer);
    }

  }

  #renderPoint(point) {
    this.type = point.type;
    this.#pointOffers = this.#pointsModel.getOffersByType(this.type);
    this.#destinationOfPoint = this.#pointsModel.getDestinationById(point.destination);
    this.#boardOffers = [...this.#pointsModel.getOffersByType(point.type).offers];

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const tripPointComponent = new TripPointView({
      point,
      offers: this.#pointOffers,
      destinations: this.#destinationOfPoint,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPointComponent = new EditPointView({
      points: this.#boardPoints,
      offers: this.#boardOffers,
      destinations: this.#boardDestinations,
      point,
      destinationOfPoint: this.#destinationOfPoint,
      onFormSubmit: () => {
        replaceFormToCard();
        document.addEventListener('keydown', escKeyDownHandler);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onEditClick: () => {
        replaceFormToCard();
        document.addEventListener('keydown', escKeyDownHandler);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(editPointComponent, tripPointComponent);
    }

    function replaceFormToCard() {
      replace(tripPointComponent, editPointComponent);
    }
    render(tripPointComponent, this.#tripPointsList.element);
  }
}
