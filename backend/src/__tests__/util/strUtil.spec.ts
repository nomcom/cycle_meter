import { strUtil } from "../../util/index.js";

describe("strUtil isTrue", () => {
  // beforeAll(() => {});
  // afterAll(() => {});
  // beforeEach(() => {});
  // afterEach(() => {});

  test("小文字のみ", async () => {
    expect(strUtil.isTrue("true")).toBeTruthy();
    expect(strUtil.isTrue(" true")).toBeTruthy();
    expect(strUtil.isTrue("true ")).toBeTruthy();
    expect(strUtil.isTrue(" true ")).toBeTruthy();
  });
  test("大文字のみ", async () => {
    expect(strUtil.isTrue("TRUE")).toBeTruthy();
    expect(strUtil.isTrue(" TRUE")).toBeTruthy();
    expect(strUtil.isTrue("TRUE ")).toBeTruthy();
    expect(strUtil.isTrue(" TRUE ")).toBeTruthy();
  });
  test("小文字大文字混在", async () => {
    expect(strUtil.isTrue("tRuE")).toBeTruthy();
    expect(strUtil.isTrue(" TrUe")).toBeTruthy();
    expect(strUtil.isTrue("truE ")).toBeTruthy();
    expect(strUtil.isTrue(" True ")).toBeTruthy();
    expect(strUtil.isTrue("\ttrue\t")).toBeTruthy();
    expect(strUtil.isTrue("　true　")).toBeTruthy();
  });

  test("undefined", async () => {
    expect(strUtil.isTrue(undefined)).toBeFalsy();
  });
  test("異常", async () => {
    expect(strUtil.isTrue("")).toBeFalsy();
    expect(strUtil.isTrue("TRU")).toBeFalsy();
    expect(strUtil.isTrue("TRU E")).toBeFalsy();
    expect(strUtil.isTrue("tru")).toBeFalsy();
    expect(strUtil.isTrue("tru e")).toBeFalsy();
    expect(strUtil.isTrue("truee")).toBeFalsy();
    expect(strUtil.isTrue("ttrue")).toBeFalsy();
  });
});
