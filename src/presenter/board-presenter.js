import { remove, render, RenderPosition } from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter.js';
import { sortDayOfPointUp, sortPriceDown } from '../utils/utils.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import NoPointsView from '../view/no-point-view.js';
import { filter } from '../utils/filter.js';
import NewEventPresenter from './new-event-presenter.js';

export default class BoardPresenter {
  #pointsModel = null;
  #boardContainer = null;
  #filterModel = null;
  #newEventPresenter = null;

  #sortComponent = null;
  #tripPointsList = new TripPointsListView();

  #noPointsComponent = null;
  #offers = null;
  #destinations = [];

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({ boardContainer, pointsModel, filterModel, onNewEventDestroy }) {
    this.#pointsModel = pointsModel;
    this.#boardContainer = boardContainer;
    this.#filterModel = filterModel;


    this.#newEventPresenter = new NewEventPresenter({
      pointListContainer: this.#tripPointsList.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortDayOfPointUp);
      case SortType.PRICE:
        return filteredPoints.sort(sortPriceDown);
    }
    return filteredPoints;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }


  get offers() {
    return this.#pointsModel.offers;
  }

  init() {
    this.#destinations = [...this.destinations];

    this.#offers = [...this.offers] ?? {};

    this.#renderBoard();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    remove(this.#sortComponent);
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }


  #renderBoard() {

    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    if (this.points.length > 0) {
      render(this.#tripPointsList, this.#boardContainer);

      this.#renderSort();

      this.#renderPoints();
    }
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init(this.#offers, this.#destinations, this.points);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripPointsList.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, this.#offers, this.#destinations, this.points);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoint() {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType
    });
    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #handleViewAction = (actionType, updateType, update) => {

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }

  };


  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());

  };

  #clearBoard({ resetSortType = false } = {}) {

    this.#newEventPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }
  }
}
