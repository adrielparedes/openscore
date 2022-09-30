import { ApiResponse } from "../model/ApiResponse";
import rest from "./Rest";

export default abstract class Service<X, Y, Z> {
  constructor(protected serviceUrl: string) {}

  public getAll(page: number, pageSize: number, parameters?: any) {
    return rest.get<ApiResponse<X[]>>(this.serviceUrl, {
      params: { page: page, pageSize: pageSize, ...parameters },
    });
  }

  public count() {
    return rest.get<ApiResponse<number>>(`${this.serviceUrl}/count`);
  }

  public get(id: number) {
    return rest.get<ApiResponse<X>>(`${this.serviceUrl}/${id}`);
  }

  public delete(id: number) {
    return rest.delete<ApiResponse<number>>(`${this.serviceUrl}/${id}`);
  }

  public enable(id: number) {
    return rest.post<ApiResponse<number>>(`${this.serviceUrl}/${id}/enable`);
  }

  public disable(id: number) {
    return rest.post<ApiResponse<number>>(`${this.serviceUrl}/${id}/disable`);
  }

  public add(storable: Y) {
    return rest.post<ApiResponse<X>>(`${this.serviceUrl}`, storable);
  }

  public update(id: number, storable: Z) {
    return rest.post<ApiResponse<X>>(`${this.serviceUrl}/${id}`, storable);
  }
}
