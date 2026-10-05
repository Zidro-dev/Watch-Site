import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Protect against missing DATABASE_URL in Vercel environment
let prismaInstance: PrismaClient;

if (!process.env.DATABASE_URL) {
  console.error("CRITICAL WARNING: DATABASE_URL is not set in environment variables! Prisma will likely fail.");
}

try {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
} catch (error) {
  console.error("Failed to initialize Prisma Client:", error);
  // Fallback to a dummy object if absolutely necessary (though Prisma usually throws on query, not init)
  prismaInstance = {} as PrismaClient;
}

export const prisma = prismaInstance;
