import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch timetable entries from database
    const timetableEntries = await prisma.timetableEntry.findMany({
      orderBy: [
        { day: 'asc' },
        { period: 'asc' }
      ]
    });

    return NextResponse.json(timetableEntries);
  } catch (error: any) {
    console.error("Timetable fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}