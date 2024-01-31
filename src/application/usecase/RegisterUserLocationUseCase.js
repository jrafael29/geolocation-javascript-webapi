import { locationFactory } from "../factory/LocationFactory.js";
import { SaveGeneratedTokenUseCase } from "./SaveGeneratedTokenUseCase.js";
import { SaveRedisMemberUseCase } from "./SaveRedisMemberUseCase.js";

export class RegisterUserLocationUseCase {
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
    const saveGeneratedTokenUseCase = new SaveGeneratedTokenUseCase(
      this.#repository
    );
    await saveRedisMemberUseCase.perform(userLocation);
    const token = await saveGeneratedTokenUseCase.perform({
      identifier: userLocation.identifier,
    });
    return token;
  }
}
