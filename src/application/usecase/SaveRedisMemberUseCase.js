export class SaveRedisMemberUseCase {
  #repository;
  constructor(redisRepository) {
    this.#repository = redisRepository;
  }
  async perform({ lat, lng, identifier, type } = data) {
    if (!lat || !lng || !identifier || !type) {
      throw new Error("invalid parameters");
    }
    const resultSave = await this.#repository.addMember({
      lat,
      lng,
      memberName: identifier,
      key: type,
    });

    if (resultSave) return true;
    return false;
  }
}
