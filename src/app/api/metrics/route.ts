import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { computeWeeklyTrends } from "@/lib/metrics/compute";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
  });
  if (!membership) {
    return NextResponse.json({ error: "No organization found" }, { status: 404 });
  }

  const period = request.nextUrl.searchParams.get("period") ?? "90d";
  const days = parseInt(period.replace("d", ""), 10) || 90;
  const weeks = Math.ceil(days / 7);

  const trends = await computeWeeklyTrends(membership.orgId, weeks);
  return NextResponse.json(trends);
}
