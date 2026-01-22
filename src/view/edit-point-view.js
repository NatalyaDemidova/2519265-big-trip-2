import { DAY_FORMAT, dateNow } from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import humanizedueDate from '../utils/utils.js';
import { getDateWithTime } from '../utils/utils.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

function createEventTypeTemplate(points, pointType = '', id) {

  const getType = (type, checked) => (`<div class="event__type-item">
            <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${type} ${checked}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type.replace(/^./, (char) => char.toUpperCase())}</label>
          </div>`);
  const pointsList = points.map(({ type }) => {
    const checked = (type === pointType) ? 'checked' : '';
    return getType(type, checked);
  });

  return pointsList.join('');
}

function createDestinationListTemplate(id, destinations) {
  if (destinations) {
    const destinationsList = destinations.map(({ name }) => (`<option value=${name}></option>`));
    return `<datalist id="destination-list-${id}">${destinationsList.join('')}</datalist>`;
  }
  return '';
}

function createDestinationOfPoint(pictures, description) {
  if ((description !== '') || (pictures.length > 0)) {
    return (
      `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          ${description ? `<p class="event__destination-description">${description}</p>` : ''}
          ${createPicturesOfDestinations(pictures)}
        </section>`
    );
  }
  return '';
}

function createOfferTemplate(offersOfPoint = [], offers, pointId) {

  function getOfferTemplate({ id, title, price } = offers) {
    const checked = offersOfPoint.find((item) => item === id) ? 'checked' : '';

    return (
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${pointId}-${id}" data-offer-id=${id} type="checkbox" name="event-offer-${pointId}" ${checked}>
          <label class="event__offer-label" for="event-offer-${pointId}-${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
      </div>`
    );

  }
  if (offers.length > 0) {

    const list = offers.map(({ id, title, price }) => getOfferTemplate({ id, title, price }));

    return (`<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${list.join('')}
            </div>
          </section>`);
  }
  return '';
}

function createPicturesOfDestinations(pictures) {

  function getPictureTemplate({ src, description }) {
    return (`<img class="event__photo" src = ${src} alt = ${description}> `);
  }

  if (pictures) {
    const list = pictures.map(({ src, description }) => getPictureTemplate({ src, description }));

    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">${list.join('')}</div>
      </div> `
    );
  }
  return '';
}

function createButtonCloseOrDelete(point) {
  return (
    `<button class="event__reset-btn" type="reset">${!point.destination ? 'Cancel' : 'Delete'}</button>`
  );
}


function createEditPointTemplate(points, offersAll, destinations, point) {
  const destinationOfPoint = (destinations.find((item) => point.destination === item.id)) || '';
  const { id = 1, basePrice = '', dateFrom = dateNow, dateTo = dateNow, type = points[0].type } = point;
  const offers = (offersAll && (offersAll.length > 0)) ? ((offersAll.find((item) => type === item.type)).offers) : '';
  const { description = '', name, pictures = [] } = destinationOfPoint;

  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeTemplate(points, type, id)}
              </fieldset>
            </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination-${id}" title="Please, enter one of the destinations available in the list" required value="${name ? he.encode(name) : ''}" list="destination-list-${id}">

            ${createDestinationListTemplate(id, destinations)}

        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${getDateWithTime(humanizedueDate(dateFrom, DAY_FORMAT.getDateWithSlash), humanizedueDate(dateFrom, DAY_FORMAT.getTime))}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${getDateWithTime(humanizedueDate(dateTo, DAY_FORMAT.getDateWithSlash), humanizedueDate(dateTo, DAY_FORMAT.getTime))}>
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" pattern="^[ 0-9]+$" title="Please enter a positive integer" type="text" name="event-price" value="${basePrice}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            ${createButtonCloseOrDelete(point)}
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          ${(offers.length > 0) || destinationOfPoint ? `<section class="event__details">
            ${createOfferTemplate(point.offers, offers, id)}
            ${((description !== '') || pictures.length) ? createDestinationOfPoint(pictures, description) : ''}
          </section>` : ''}
        </form>
      </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #point = null;
  #points = null;
  #destinations = null;
  #offersAll = null;
  #handleFormSubmit = null;
  #handleEditClick = null;
  #handleDeleteClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point, offers, destinations, points, onFormSubmit, onEditClick, onDeleteClick }) {
    super();
    this.#point = point || DEFAULT_POINT;
    this.#points = points;
    this.#offersAll = offers;
    this.#destinations = destinations;

    this._setState(EditPointView.parsePointToState(this.#point, this.#point.type));

    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this.#points, this.#offersAll, this.#destinations, this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }


  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#offersClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('blur', this.#destinationBlurHandler);

    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceClickHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteHandler);

    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerCheckClickHandler);
    }
    this.#setDatepikerFrom();
    this.#setDatepikerTo();
  }

  #offerCheckClickHandler = (evt) => {
    if (!this._state.offers.includes(evt.target.dataset.offerId)) {
      this._setState({
        offers: [...this._state.offers, evt.target.dataset.offerId],
      });
    } else {
      this._setState({
        offers: this._state.offers.filter((item) => item !== evt.target.dataset.offerId),
      });
    }
  };

  #dateFromChangeHandler = ([dateFrom]) => {
    this._setState({
      dateFrom: dateFrom,
    });
  };

  #dateToChangeHandler = ([dateTo]) => {
    this._setState({
      dateTo: dateTo,
    });
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #offersClickHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
    });
  };

  #destinationClickHandler = (evt) => {
    evt.preventDefault();

    const value = evt.target.value.trim();
    const destination = (this.#destinations.find((item) => value === item.name));

    if (destination) {
      this.updateElement({
        destination: destination.id,
      });
    }
  };

  #destinationBlurHandler = (evt) => {
    const value = evt.target.value.trim();

    const destination = (this.#destinations.find((item) => value === item.name));

    evt.target.value = (destination) ? destination.name : '';

  };

  #priceClickHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #setDatepikerFrom() {
    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          enableTime: true,
          maxDate: this._state.dateTo,
          onClose: this.#dateFromChangeHandler,
        }
      );
    }
  }

  #setDatepikerTo() {
    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          enableTime: true,
          minDate: this._state.dateFrom,
          onClose: this.#dateToChangeHandler,
        }
      );
    }
  }

  static parsePointToState(point) {
    return {
      ...point,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    return point;
  }
}
