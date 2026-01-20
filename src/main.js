import BoardPresenter from './presenter/board-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';
import { render } from './framework/render.js';

const newEventButtonContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(
  {
    boardContainer: siteMainElement,
    pointsModel,
    filterModel,
    onNewEventDestroy: handleNewEventFormClose
  });

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointsModel
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newEventButtonComponent.element.disabled = true;
}

render(newEventButtonComponent, newEventButtonContainer);
filterPresenter.init();
boardPresenter.init();
