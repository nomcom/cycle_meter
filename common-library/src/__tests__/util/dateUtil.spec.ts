import { describe, test, expect } from "@jest/globals";
import { dateUtil } from "../../util/index.js";

describe("dateUtil toDateString", () => {
  // beforeAll(() => {});
  // afterAll(() => {});
  // beforeEach(() => {});
  // afterEach(() => {});

  test("OK", async () => {
    expect(dateUtil.toDateString(null)).toBe("");
    expect(dateUtil.toDateString(dateUtil.TIMEZONE_OFFSET_MILLISEC)).toBe(
      "1970-01-01"
    );
    expect(
      dateUtil.toDateString(
        dateUtil.TIMEZONE_OFFSET_MILLISEC + 24 * 60 * 60 * 1000
      )
    ).toBe("1970-01-02");
  });

  expect(dateUtil.toDateString(1582815600000)).toBe("2020-02-28");
  expect(dateUtil.toDateString(1582902000000)).toBe("2020-02-29");
  expect(dateUtil.toDateString(1582988400000)).toBe("2020-03-01");
});

describe("dateUtil toUnixMilliSec", () => {
  // beforeAll(() => {});
  // afterAll(() => {});
  // beforeEach(() => {});
  // afterEach(() => {});

  test("null", async () => {
    expect(dateUtil.toUnixMilliSec(null)).toBe(null);
    expect(dateUtil.toUnixMilliSec("")).toBe(null);
    expect(dateUtil.toUnixMilliSec("yyyy-MM-dd")).toBe(null);
    expect(dateUtil.toUnixMilliSec("12-12-12")).toBe(null);
    expect(dateUtil.toUnixMilliSec("123-12-12")).toBe(null);
    expect(dateUtil.toUnixMilliSec("2020/12/12")).toBe(null);
  });
  test("OK", async () => {
    expect(dateUtil.toUnixMilliSec("2020-02-28")).toBe(1582815600000);
    expect(dateUtil.toUnixMilliSec("2020-02-29")).toBe(1582902000000);
    expect(dateUtil.toUnixMilliSec("2020-03-01")).toBe(1582988400000);
  });
});
