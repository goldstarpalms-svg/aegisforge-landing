import { NextResponse } from "next/server";

import { subscribeToWaitlist } from "@/services/waitlist";
import type { WaitlistSubmission } from "@/types/waitlist";

export async function POST(request: Request) {
  const payload = (await request.json()) as WaitlistSubmission;
  const result = await subscribeToWaitlist(payload);

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, { status: 202 });
}
