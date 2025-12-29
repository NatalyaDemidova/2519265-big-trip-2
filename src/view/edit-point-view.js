import { DAY_FORMAT, dateNow } from '../const';
import AbstractView from '../framework/view/abstract-view.js';
// import { createElement } from '../render';
import humanizedueDate from '../utils/utils.js';
import {getDateWithTime} from '../utils/utils.js';

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

function createDestinationListTemplate(destinations) {
  if (destinations) {
    const destinationsList = destinations.map(({ name }) => (`<option value=${name}></option>`));
    return `<datalist id="destination-list-1">${destinationsList.join('')}</datalist>`;
  } else {
    return '';
  }
}

function createDestinationOfPoint(destination, pictures, description) {

  if (destination.name) {
    return (
      `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${createPicturesOfDestinations(pictures)}
          </section>`
    );
  } else {
    return '';
  }
}

function createOfferTemplate(offersOfPoint = [], offers, pointId) {
  function getOfferTemplate({ id, title, price } = offers) {
    const checked = offersOfPoint.find((item) => item === id) ? 'checked' : '';

    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-${pointId}" type="checkbox" name="event-offer-${pointId}" ${checked}>
          <label class="event__offer-label" for="event-offer-${id}-${pointId}">
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
  } else {
    return '';
  }
}

function createPicturesOfDestinations(pictures) {

  function getPictureTemplate({ src, description }) {
    return (`<img class="event__photo" src=${src} alt=${description}>`);
  }

  if (pictures) {
    const list = pictures.map(({ src, description }) => getPictureTemplate({ src, description }));

    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${list.join('')}
        </div>
      </div>`
    );
  } else {
    return '';
  }
}

function createButtonCloseOrDelete(point) {
  if (!point.type) {
    return (
      '<button class="event__reset-btn" type="reset">Cancel</button>'
    );
  }else {
    return (
      '<button class="event__reset-btn" type="reset">Delete</button>'
    );
  }
}

function createEditPointTemplate(points, offers, destinations, point, destinationOfPoint) {
  const { id = 1, basePrice = '', dateFrom = dateNow, dateTo = dateNow, type = points[0].type } = point;

  const { description = '', name, pictures = [] } = destinationOfPoint;

  return (
    `<li class="trip-events__item">
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
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name ? name : ''}" list="destination-list-1">

              ${createDestinationListTemplate(destinations)}

          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"  value=${getDateWithTime(humanizedueDate(dateFrom, DAY_FORMAT.getDateWithSlash), humanizedueDate(dateFrom, DAY_FORMAT.getTime))}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${getDateWithTime(humanizedueDate(dateTo, DAY_FORMAT.getDateWithSlash), humanizedueDate(dateTo, DAY_FORMAT.getTime))}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${createButtonCloseOrDelete(point)}
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
         ${createOfferTemplate(point.offers, offers, id)}
         ${createDestinationOfPoint(destinationOfPoint, pictures, description)}
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractView {
  #points = null;
  #offers = null;
  #destinations = null;
  #point = null;
  #destinationOfPoint = null;
  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({points, offers, destinations, point, destinationOfPoint, onFormSubmit, onEditClick}) {
    super();

    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#point = point || {};
    this.#destinationOfPoint = destinationOfPoint || {};

    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditPointTemplate(this.#points, this.#offers, this.#destinations, this.#point, this.#destinationOfPoint);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
