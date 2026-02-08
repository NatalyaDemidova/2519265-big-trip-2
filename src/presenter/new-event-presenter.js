import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewEventPresenter {

  #offers = null;
  #destinations = null;
  #points = null;

  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  #isAnimating = false;

  constructor({ pointListContainer, onDataChange, onDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;

    this.#handleDestroy = onDestroy;
  }

  init(offers, destinations, points) {

    if (JSON.stringify(offers) !== JSON.stringify([{}])) {
      this.#offers = offers;

    }

    this.#destinations = destinations;
    this.#points = points;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditPointView({
      offers: this.#offers,
      destinations: this.#destinations,
      points: this.#points,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: this.#handleDeleteClick,

      onDeleteClick: this.#handleDeleteClick,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }


  destroy() {

    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);

    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }


  #handleFormSubmit = (point) => {

    this.#handleDataChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      { ...point },
    );
  };


  #handleDeleteClick = () => {
    this.destroy();
  };


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      if(this.#isAnimating === true) {
        return;
      }
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving() {
    this.#pointEditComponent.updateElement({
      isSaving: true,
      isDeleting: true,
    });
  }

  setAborting() {

    this.#isAnimating = true;

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isSaving: false,
        isDeleting: false,
      });

      this.#isAnimating = false;
    };
    this.#pointEditComponent.shake(resetFormState);
  }
}
