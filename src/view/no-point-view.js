import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

function createNoPointsTemplate(filterType) {
  const noPointTextValue = NoPointTextType[filterType];
  return (
    `<p class="trip-events__msg">${noPointTextValue}</p>`
  );
}

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
