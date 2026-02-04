import { remove, render, RenderPosition } from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter.js';
import { sortDurationOfPointUp, sortPriceDown, sortDayOfPointUp } from '../utils/utils.js';
import { FilterType, SortType, TimeLimitBlock, UpdateType, UserAction } from '../const.js';
import NoPointsView from '../view/no-point-view.js';
import { filter } from '../utils/filter.js';
import NewEventPresenter from './new-event-presenter.js';
import { LoadingView } from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { FailedLoadDataView } from '../view/failed-load-data-view.js';

export default class BoardPresenter {
  #pointsModel = null;
  #boardContainer = null;
  #filterModel = null;
  #newEventPresenter = null;

  #sortComponent = null;
  #tripPointsList = new TripPointsListView();
  #loadingComponent = new LoadingView();
  #failedLoadDataComponent = new FailedLoadDataView();

  #noPointsComponent = null;

  #onNewEventDestroy = null;

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #errorLoad = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimitBlock.LIMIT_LOWER,
    upperLimit: TimeLimitBlock.LIMIT_UPPER,
  });

  constructor({ boardContainer, pointsModel, filterModel, onNewEventDestroy, onErrorLoad }) {
    this.#pointsModel = pointsModel;
    this.#boardContainer = boardContainer;
    this.#filterModel = filterModel;

    this.#onNewEventDestroy = onNewEventDestroy;

    this.#errorLoad = onErrorLoad;


    this.#newEventPresenter = new NewEventPresenter({
      pointListContainer: this.#tripPointsList.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewEventDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDayOfPointUp);
      case SortType.TIME:
        return filteredPoints.sort(sortDurationOfPointUp);
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

  get err() {
    return this.#pointsModel.err;
  }


  init() {

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

  #handleNewEventDestroy = () => {
    this.#onNewEventDestroy();
    if ((this.points.length === 0) || !this.#noPointsComponent) {
      this.#renderNoPoint();
    }
  };


  #renderBoard() {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.err) {
      this.#renderFailedLoadData();
      this.#errorLoad();
      return;
    }

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
    render(this.#tripPointsList, this.#boardContainer);
    remove(this.#noPointsComponent);
    this.#newEventPresenter.init(this.offers, this.destinations, this.points);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripPointsList.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onFormCloseWithoutSave: this.#handleFormCloseWithoutSave,
    });

    pointPresenter.init(point, this.offers, this.destinations, this.points);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleFormCloseWithoutSave() {
    remove(this.#tripPointsList);
    this.#renderNoPoint();
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }

        break;
      case UserAction.ADD_POINT_POINT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);

        } catch (err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);

        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
    }

    if (this.#failedLoadDataComponent) {
      remove(this.#failedLoadDataComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.BEFOREEND);
  }

  #renderFailedLoadData() {
    render(this.#failedLoadDataComponent, this.#boardContainer, RenderPosition.BEFOREEND);
  }
}
