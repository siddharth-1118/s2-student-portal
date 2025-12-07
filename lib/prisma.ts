import { PrismaClient } from '@prisma/client'

// FIX: Force the database URL for the app (Next.js)
// This fixes the "PrismaClient needs to be constructed" error.
process.env.DATABASE_URL = 'file:./dev.db'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma