import { Method } from '../const';
import ApiService from '../framework/api-service';


export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  async updatePoints(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptedToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async postedPoint(point) {

    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptedToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletedPoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptedToServer(point) {
    const apdatedPoint = {
      ...point,
      'base_price': Number(point.basePrice),
      'date_to': point.dateTo,
      'date_from': point.dateFrom,
      'is_favorite': point.isFavorite,
    };

    delete apdatedPoint.basePrice;
    delete apdatedPoint.dateTo;
    delete apdatedPoint.dateFrom;
    delete apdatedPoint.isFavorite;

    return apdatedPoint;
  }
}
