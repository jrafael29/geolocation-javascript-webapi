export class GetUserLocationUseCase {
  #repository;
  constructor(redisRepository) {
    this.#repository = redisRepository;
  }

  async perform({ lat, lng }) {
    const result = await this.#repository.getMembers({
      lat,
      lng,
      distanceType: "KM",
      radius: "999",
      key: "users",
    });
    return result;
  }
}
