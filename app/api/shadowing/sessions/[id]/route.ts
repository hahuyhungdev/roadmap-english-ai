import { NextRequest, NextResponse } from "next/server";
import {
  getShadowingSession,
  updateShadowingSession,
  deleteShadowingSession,
} from "../../../../../src/lib/cache";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/shadowing/sessions/[id]
export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 },
      );
    }
    const session = await getShadowingSession(numId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to get session" },
      { status: 500 },
    );
  }
}

// PATCH /api/shadowing/sessions/[id]
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 },
      );
    }
    const body = await req.json();
    await updateShadowingSession(numId, body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update session" },
      { status: 500 },
    );
  }
}

// DELETE /api/shadowing/sessions/[id]
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 },
      );
    }
    await deleteShadowingSession(numId);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete session" },
      { status: 500 },
    );
  }
}
