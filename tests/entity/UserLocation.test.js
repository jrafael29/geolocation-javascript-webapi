import assert from "node:assert";
import test from "node:test";
import { UserLocation as UserLocationEntity } from "../../src/domain/entity/UserLocation.js";

test("deveria lançar erro ao tentar criar uma entidade com parametros inválidos", () => {
  assert.throws(
    () => {
      new UserLocationEntity({
        lat: "",
        lng: "",
        identifier: "",
        type: "",
      });
    },
    {
      message: "invalid lat",
    }
  );

  assert.throws(
    () => {
      new UserLocationEntity({
        lat: "123",
        lng: "",
        identifier: "",
        type: "",
      });
    },
    {
      message: "invalid lng",
    }
  );

  assert.throws(
    () => {
      new UserLocationEntity({
        lat: "123",
        lng: "123",
        identifier: "",
        type: "",
      });
    },
    {
      message: "invalid identifier",
    }
  );

  assert.throws(
    () => {
      new UserLocationEntity({
        lat: "123",
        lng: "123",
        identifier: "123",
        type: "",
      });
    },
    {
      message: "invalid type",
    }
  );

  // assert.doesNotThrow(() => {
  //   new UserLocationEntity({
  //     lat: -8.231,
  //     lng: -35.765,
  //     identifier: "kakren",
  //     type: "users",
  //   });
  // }, Error);
});
