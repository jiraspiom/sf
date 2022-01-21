import { FieldItem, GameState } from "../GameProvider";

import { plant } from "./plant";

const EMPTY_FIELDS: FieldItem[] = Array(20)
  .fill(null)
  .map((_, fieldIndex) => ({ fieldIndex }));

let GAME_STATE: GameState = {
  fields: EMPTY_FIELDS,
  actions: [],
  balance: 0,
  inventory: {},
  level: 1,
};

describe("plant", () => {
  it("does not plant if goblins are around", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 6,
        item: "Sunflower Seed",
      })
    ).toThrow("Goblin land!");
  });

  it("plants if they have pumpkin soup", () => {
    const state = plant(
      {
        ...GAME_STATE,
        inventory: {
          "Pumpkin Soup": 1,
          "Potato Seed": 2,
        },
      },
      {
        type: "item.planted",
        index: 6,
        item: "Potato Seed",
      }
    );

    expect(state.inventory["Potato Seed"]).toEqual(1);
    expect(state.fields[6]).toEqual({
      crop: {
        name: "Potato",
        plantedAt: expect.any(Date),
      },
      fieldIndex: 6,
    });
  });

  it("does not plant if crop already exists", () => {
    expect(() =>
      plant(
        {
          ...GAME_STATE,
          fields: [
            {
              fieldIndex: 0,
              crop: {
                name: "Sunflower",
                plantedAt: new Date(),
              },
            },
          ],
        },
        {
          type: "item.planted",
          index: 0,
          item: "Sunflower Seed",
        }
      )
    ).toThrow("Crop is already planted");
  });

  it("does not plant an invalid item", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 0,
        item: "Pickaxe",
      })
    ).toThrow("Not a seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 0,
        item: "Sunflower Seed",
      })
    ).toThrow("Not enough seeds");
  });

  it("plants a seed", () => {
    const state = plant(
      {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": 5,
        },
      },
      {
        type: "item.planted",
        index: 0,
        item: "Sunflower Seed",
      }
    );

    expect(state).toEqual({
      ...GAME_STATE,
      inventory: {
        "Sunflower Seed": 4,
      },
      fields: [
        {
          crop: {
            name: "Sunflower",
            plantedAt: expect.any(Date),
          },
          fieldIndex: 0,
        },
        ...EMPTY_FIELDS.slice(1),
      ],
    });
  });
});