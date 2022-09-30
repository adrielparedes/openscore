import { ApiResponse } from "../model/ApiResponse";
import { Ranking } from "../model/Ranking";
import rest from "./Rest";

export class RankingService {
  public getAll(pais: string, size: number) {
    const params = { pais: pais, size: size.toString() };
    return rest.get<ApiResponse<Ranking[]>>("ranking", {
      params: params,
    });
  }
}
