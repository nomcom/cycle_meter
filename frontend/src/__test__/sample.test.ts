import { add } from "./sample";

describe("add", () => {
  it("1 + 2 = 3", () => {
    const result = add(1, 2);

    expect(result).toBe(3);
  });

  it("1 + 1 = 2", () => {
    const result = add(1, 1);

    expect(result).toBe(2);
  });
});
