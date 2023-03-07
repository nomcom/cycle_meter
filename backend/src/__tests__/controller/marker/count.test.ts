import { jest } from "@jest/globals";
import { prismaMock } from "../../prismaMock.js";
import { handler } from "../../../controller/marker/count.js";

describe("/marker/count", () => {
  test("count正しいカウントが返ってくること", async () => {
    // 準備
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.marker.count = jest.fn() as any;
    prismaMock.marker.count.mockResolvedValue(10);

    // Mock関数
    const mockFunction = jest.fn();
    const response = {
      json: mockFunction,
    };

    // テスト対象実行
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler({} as any, response as any, null as any);

    // 確認
    expect(mockFunction.mock.calls.length).toBe(1); // mockFunction関数は1度呼び出された
    expect(mockFunction.mock.calls[0]).toEqual([10]); // mockFunction関数が1度呼び出された際の引数
  });
});
