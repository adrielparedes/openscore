import { ApiResponse } from "../model/ApiResponse";
import Standing from "../model/Standing";
import rest from "./Rest";
import Service from "./Service";

export class StandingsService extends Service<Standing, Standing, Standing> {
  constructor() {
    super("standings");
  }

  calculate() {
    return rest.get<ApiResponse<string>>(`${this.serviceUrl}/calculate`);
  }
}
