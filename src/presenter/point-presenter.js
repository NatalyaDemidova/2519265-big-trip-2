import { UpdateType, UserAction } from '../const';
import { remove, render, replace } from '../framework/render';
import { isDateEqual } from '../utils/utils';
import EditPointView from '../view/edit-point-view';
import TripPointView from '../view/trip-point-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #points = null;
  #offersOfPoint = [];
  #destination = null;
  #destinations = [];
  #offersOfPointAll = [];
  #offersAll = [];

  #handleDataChange = null;
  #handleModeChange = null;
  #isAnimating = false;

  constructor({ pointListContainer, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, offers, destinations, points) {

    this.#point = point;

    this.#points = points;
    this.type = point.type;

    this.#destinations = destinations;

    if (offers.length > 0) {
      this.#offersAll = offers;
      this.#offersOfPointAll = (this.#offersAll.find((item) => this.type === item.type)).offers;
      this.#offersOfPoint = this.#offersOfPointAll.filter((item) => this.#point.offers.includes(item.id));
    }


    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new TripPointView({
      point: this.#point,
      offers: this.#offersOfPoint,
      destinations: this.#destinations,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new EditPointView({
      offers: this.#offersAll,
      destinations: this.#destinations,
      points: this.#points,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: this.#handleEditClickClose,
      onDeleteClick: this.#handleDeleteClick,
      point: this.#point,
    });


    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.updateElement(this.#point);

      this.#replaceFormToCard();
    }
  }

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleEditClickClose = () => {
    this.#pointEditComponent.updateElement(this.#point);
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleFormSubmit = (point) => {
    const isMinorUpdate =
      !isDateEqual(this.#point.dateFrom, UpdateType.dateFrom) ||
      !isDateEqual(this.#point.dateFrom, UpdateType.dateFrom) ||
      (this.#point.basePrice !== UpdateType.basePrice);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isSaving: true,
        isDisabling: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDeleting: true,
        isDisabling: true,
      });
    }
  }

  setAborting() {
    this.#isAnimating = true;

    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabling: false,
      });

      this.#isAnimating = false;

    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #escKeyDownHandler = (evt) => {

    if ((evt.key === 'Escape') || (evt.key === 'Esc')) {

      if (this.#isAnimating === true) {
        return;
      }

      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);

      this.#replaceFormToCard();
    }
  };
}
