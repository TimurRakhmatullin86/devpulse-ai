import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { handlePullRequestEvent } from "@/lib/github/webhook-handler";

function verifySignature(payload: string, signature: string | null): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected =
    "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");

  if (process.env.GITHUB_WEBHOOK_SECRET && !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (event === "pull_request") {
    const result = await handlePullRequestEvent(payload);
    return NextResponse.json(result);
  }

  if (event === "ping") {
    return NextResponse.json({ status: "pong" });
  }

  return NextResponse.json({ status: "ignored", event });
}
