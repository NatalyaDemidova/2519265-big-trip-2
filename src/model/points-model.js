import { offers } from '../mocks/offers';
import { destinations } from '../mocks/destinations';
import {points} from '../mocks/points';

export default class PointsModel {

  points = points;
  offers = offers.slice();
  destinations = destinations.slice();


  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType(type) {
    return this.offers.find((item) => type === item.type);
  }

  getDestinationById(id) {
    return this.destinations.find((item) => id === item.id);
  }
}
