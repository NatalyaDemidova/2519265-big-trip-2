import { createElement } from '../render';

function createTripPointsListTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class TripPointsListView {
  getTemplate() {
    return createTripPointsListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
