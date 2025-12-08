// app/api/circulars/list/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if the Circular model exists by trying to query it
    // If it doesn't exist, this will throw an error
    const circulars = await prisma.$queryRaw`SELECT * FROM "Circular" ORDER BY "createdAt" DESC`;
    
    // Convert the result to plain objects
    const formattedCirculars = (circulars as any[]).map(circular => ({
      ...circular,
      createdAt: circular.createdAt.toISOString(),
      updatedAt: circular.updatedAt.toISOString()
    }));
    
    return NextResponse.json(formattedCirculars);
  } catch (e) {
    console.error("Circular fetch error:", e);
    // Return empty array if table doesn't exist yet
    return NextResponse.json([]);
  }
}