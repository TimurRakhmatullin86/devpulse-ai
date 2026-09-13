import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

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

  const aiFilter = request.nextUrl.searchParams.get("ai");
  const parsedLimit = parseInt(request.nextUrl.searchParams.get("limit") ?? "50", 10);
  const parsedOffset = parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10);
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 200) : 50;
  const offset = Number.isFinite(parsedOffset) ? Math.max(parsedOffset, 0) : 0;

  const where: Record<string, unknown> = { repo: { orgId: membership.orgId } };
  if (aiFilter === "true") where.isAiAssisted = true;
  if (aiFilter === "false") where.isAiAssisted = false;

  const [prs, total] = await Promise.all([
    prisma.pullRequest.findMany({
      where,
      include: { repo: { select: { name: true, fullName: true } }, metric: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.pullRequest.count({ where }),
  ]);

  return NextResponse.json({ data: prs, total, limit, offset });
}
