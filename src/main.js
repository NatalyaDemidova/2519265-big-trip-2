import FiltersView from './view/filters-view';
import { render } from './render';
import BoardPresenter from './presenter/board-presenter';

const filtersContainer = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: siteMainElement});

render(new FiltersView(), filtersContainer);

boardPresenter.init();

