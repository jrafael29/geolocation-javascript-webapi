export class SaveGeneratedTokenUseCase {
  #repository;
  constructor(redisRepository) {
    this.#repository = redisRepository;
  }
  async perform({ identifier }) {
    const token = `${
      process.env.SECRET_KEY
    }.${identifier}.${new Date().valueOf()}`;
    await this.#repository.addToken(token);
    return token;
  }
}
