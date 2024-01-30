import { getIdentifierFromToken } from "../../utils/index.js";

export class RedisRepository {
  #redisConn;

  constructor(redisConn) {
    if (!redisConn) throw new Error("invalid injection");
    this.#redisConn = redisConn;
  }

  async addMember({ lat, lng, memberName, key }) {
    if (!lat || !lng || !memberName || !key)
      throw new Error("invalid parameters");
    return this.#redisConn.geoadd(key, [lng, lat, memberName]);
  }

  removeMember({ key, identifier }) {
    return this.#redisConn.zrem(key, identifier);
  }

  updateMember() {}

  async addToken(token) {
    if (!token) throw new Error("invalid token");
    return this.#redisConn.setex(token, 300, JSON.stringify(true));
  }

  async removeToken(token) {
    if (!token) throw new Error("invalid token");
    return this.#redisConn.del(token);
  }
}
