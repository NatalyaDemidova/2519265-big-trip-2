import FiltersView from './view/filters-view';
import { render } from './render';
import BoardPresenter from './presenter/board-presenter';
import PointsModel from './model/points-model';

const filtersContainer = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({boardContainer: siteMainElement}, pointsModel);

render(new FiltersView(), filtersContainer);

boardPresenter.init();

// console.log(pointsConst.getDestination());
// console.log(points)

