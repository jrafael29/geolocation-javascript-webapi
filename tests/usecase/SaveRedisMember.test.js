import assert from "node:assert";
import test from "node:test";
import { SaveRedisMember } from "../../src/application/usecase/SaveRedisMemberUseCase.js";
import { UserLocation } from "../../src/domain/entity/UserLocation.js";

test("deveria", () => {
  const saveRedisMemberUseCase = new SaveRedisMember("");
  const hehe = new UserLocation({
    lat: "haha",
    lng: "hehe",
    identifier: "8123",
    type: "users",
  });
  assert.rejects(
    async () => {
      await saveRedisMemberUseCase.perform("eae");
    },
    {
      message: "invalid parameters",
    }
  );
});

test("deveria", () => {
  const saveRedisMemberUseCase = new SaveRedisMember("");
  const userLocationInstance = new UserLocation({
    lat: "123",
    lng: "321",
    identifier: "juse rafael da selva",
    type: "users",
  });
  assert.doesNotReject(
    async () => {
      await saveRedisMemberUseCase.perform({
        lat: userLocationInstance.getLat(),
        lng: userLocationInstance.getLng(),
        identifier: userLocationInstance.getIdentifier(),
        type: userLocationInstance.getType(),
      });
    },
    {
      message: "invalid parameters",
    }
  );
});
