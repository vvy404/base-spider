/**
 * When working with a framework like Next.js, it is important to use a singleton pattern for the Prisma Client instance. Otherwise, you may run into issues with hot reloading and multiple instances of the Prisma Client in development mode. Use the following code snippet to create a singleton for the Prisma Client instance:
 */

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;