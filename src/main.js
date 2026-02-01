import BoardPresenter from './presenter/board-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';
import { render } from './framework/render.js';
import PointsApiService from './data-api-service/points-api-service.js';
import OffersApiService from './data-api-service/offers-api-service.js';
import DestinationsApiService from './data-api-service/destinations-api-service.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const AUTHORIZATION = 'Basic eo0w590ik2jmkk9a';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';
const mainContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

const filterModel = new FilterModel();

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION),
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION),

});

const tripInfoPresenter = new TripInfoPresenter({
  mainContainer: mainContainer,
  pointsModel
});


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

render(newEventButtonComponent, mainContainer);
filterPresenter.init();
boardPresenter.init();
pointsModel.init();
tripInfoPresenter.init();

