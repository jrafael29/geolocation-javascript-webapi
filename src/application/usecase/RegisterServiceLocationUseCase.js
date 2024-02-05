import { locationFactory } from "../factory/LocationFactory.js";
import { SaveRedisMemberUseCase } from "./SaveRedisMemberUseCase.js";

export class RegisterServiceLocationUseCase {
  #repository;

  constructor(redisRepository) {
    this.#repository = redisRepository;
  }

  async perform({ lat, lng, identifier, type }) {
    if (!lat || !lng || !identifier || !type) {
      throw new Error("invalid parameters");
    }
    const data = {
      lat,
      lng,
      identifier,
      type,
    };
    const userLocation = locationFactory(data);
    const saveRedisMemberUseCase = new SaveRedisMemberUseCase(this.#repository);
    return await saveRedisMemberUseCase.perform(userLocation);
  }
}
