import { render } from '../render';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import EditPointView from '../view/edit-point-view.js';
import TripPointView from '../view/trip-point-view.js';
import { getRundomArrayElement } from '../utils.js';

export default class BoardPresenter {
  tripPointsList = new TripPointsListView();


  constructor({ boardContainer }, pointsModel) {
    this.pointsModel = pointsModel;
    this.boardContainer = boardContainer;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];
    this.boardDestinations = [...this.pointsModel.getDestinations()];
    this.boardOffers = [...this.pointsModel.getOffersByType(this.boardPoints[0].type).offers];
    this.destinationOfPoint = this.pointsModel.getDestinationById(this.boardPoints[0].destination);

    render(new SortView(), this.boardContainer);
    render(this.tripPointsList, this.boardContainer);

    render(new EditPointView({points: this.boardPoints}, {offers: this.boardOffers}, {destinations: this.boardDestinations}), this.tripPointsList.getElement());
    render(new EditPointView({points: this.boardPoints}, {offers: this.boardOffers}, {destinations: this.boardDestinations}, {point: this.boardPoints[0]}, {destinationOfPoint: this.destinationOfPoint}), this.tripPointsList.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      this.type = this.boardPoints[i].type;
      this.pointOffers = this.pointsModel.getOffersByType(this.type);

      render(new TripPointView({ point: this.boardPoints[i] }, { offers: this.pointOffers }, { destinations: getRundomArrayElement(this.boardDestinations) }), this.tripPointsList.getElement());
    }
  }
}
