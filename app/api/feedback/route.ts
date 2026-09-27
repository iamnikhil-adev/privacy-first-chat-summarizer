import { NextResponse } from "next/server";
import { z } from "zod";
import { persistFeedback } from "@/lib/data";

const requestSchema = z.object({
  summaryId: z.string().min(1),
  rating: z.enum(["UP", "DOWN"]),
  isPrivacyComplaint: z.boolean().optional(),
  note: z.string().max(500).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid feedback payload." }, { status: 400 });
  }

  const saved = await persistFeedback(parsed.data);

  return NextResponse.json(saved);
}
