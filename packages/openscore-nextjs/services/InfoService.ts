import { ApiResponse } from "./../model/ApiResponse";
import rest from "./Rest";
import Service from "./Service";

export class InfoService extends Service<any, any, any> {
  constructor() {
    super("info");
  }

  public securePing() {
    return rest.get<ApiResponse<string>>(`${this.serviceUrl}/ping/secure`);
  }
}
