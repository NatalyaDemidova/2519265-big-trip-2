import { render } from '../render';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import FormNewTripView from '../view/form-new-trip-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripPointView from '../view/trip-point-view.js';


export default class BoardPresenter {
  tripPointsList = new TripPointsListView();


  constructor({ boardContainer }) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.boardContainer);
    render(this.tripPointsList, this.boardContainer);


    render(new FormNewTripView(), this.tripPointsList.getElement());
    render(new EditPointView(), this.tripPointsList.getElement());

    for(let i = 0; i < 3; i++) {
      render(new TripPointView(), this.tripPointsList.getElement());
    }
  }
}
