/** @type {import('ts-jest').JestConfigWithTsJest} */

// Unit Test設定
// https://archive.jestjs.io/docs/ja/configuration
export default {
  // [...]
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^ROOTDIR(/.*)$': '<rootDir>$1',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  // ***************************
  // カバレッジ設定
  // ***************************
  // カバレッジ情報を取得するかどうか
  collectCoverage: true,
  // 取得する対象のファイルを指定する globパターンの配列
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/app.ts',
    '!src/rest/**/*',
  ],
  // 出力するファイルを格納するディレクトリ
  coverageDirectory: "../doc/coverage/common-library"
}