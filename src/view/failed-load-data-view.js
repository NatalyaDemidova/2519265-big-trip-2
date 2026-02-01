import AbstractView from '../framework/view/abstract-view';

function createFailedLoadDataTemplate() {
  return ('<p class="trip-events__msg">Failed to load latest route information</p>');
}

export class FailedLoadDataView extends AbstractView {

  get template() {
    return createFailedLoadDataTemplate();
  }
}
