import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, isChecked) {
  const { type, count } = filter;

  return (`
    <div class="trip-filters__filter">
      <input id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      ${isChecked ? 'checked' : ''}
      ${!count ? 'disabled' : ''}
      value=${type}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type} ${count}</label>
  </div>`);
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return (`<div class="trip-main__trip-controls  trip-controls">
            <div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">
              ${filterItemsTemplate}
              </form>
            </div>
          </div>`);
}

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}

