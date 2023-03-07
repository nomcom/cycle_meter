import { jest } from "@jest/globals";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClient } from "../../prisma/generated/db/index.js";
import { prisma } from "../db/client.js";

jest.mock("ROOTDIR/src/db/client", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  // Mockをリセット
  jest.resetAllMocks();
});

export const prismaMock = prisma as DeepMockProxy<PrismaClient>;
