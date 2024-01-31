import { getIdentifierFromToken } from "../../utils/index.js";

function formatGeoMembers(members = [], key) {
  if (!members.length) return members;

  return members.map((member) => {
    const memberName = member[0];
    const memberDistance = member[1];
    const memberLatLng = member[2]; // [lng, lat]

    return {
      identifier: memberName,
      distance: memberDistance,
      lat: memberLatLng[1],
      lng: memberLatLng[0],
      type: key,
    };
  });
}

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

  async getMembers({ key, lat, lng, radius, distanceType }) {
    console.log({ key, lat, lng, radius, distanceType });
    const membersResult = await this.#redisConn.georadius(
      key,
      lng,
      lat,
      radius,
      distanceType,
      "WITHCOORD",
      "WITHDIST"
    );
    return formatGeoMembers(membersResult, key);
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
