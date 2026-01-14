import { remove, render, RenderPosition } from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter.js';
import { sortDayOfPointUp, sortPriceDown, updateItem } from '../utils/utils.js';
import { SortType } from '../const.js';
import NoPointsView from '../view/no-point-view.js';

export default class BoardPresenter {
  #pointsModel = null;
  #boardContainer = null;

  #sortComponent = null;
  #tripPointsList = new TripPointsListView();

  #boardPoints = [];
  #noPointsComponent = null;
  #boardOffers = null;
  #boardDestinations = [];

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];

  constructor({ boardContainer }, pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardContainer = boardContainer;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearTripPresenters();
    this.#renderPoints();
  };

  #renderSort() {
    remove(this.#sortComponent);
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }


  #renderBoard() {

    if (this.#boardPoints.length === 0) {
      this.#renderNoPoint();
      return;
    }

    if (this.#boardPoints.length > 0) {
      render(this.#tripPointsList, this.#boardContainer);

      this.#renderSort();

      this.#renderPoints();
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripPointsList.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, this.#boardOffers, this.#boardDestinations, this.#boardPoints);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoint() {
    this.#noPointsComponent = new NoPointsView();
    render(this.#noPointsComponent, this.#boardContainer.element);
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }

  #clearTripPresenters() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#boardOffers, this.#boardDestinations, this.#boardPoints);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());

  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#boardPoints.sort(sortDayOfPointUp);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPriceDown);
        break;
      default:
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }
    this.#currentSortType = sortType;
  }

}
