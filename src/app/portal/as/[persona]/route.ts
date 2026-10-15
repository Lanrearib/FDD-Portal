import { NextResponse } from "next/server";
import { PERSONA_COOKIE } from "@/lib/portal";
import { personas, type PersonaId } from "@/lib/portal-data";

// Prototype only: switch which demo candidate the portal shows, then open their Home.
export async function GET(request: Request, ctx: RouteContext<"/portal/as/[persona]">) {
  const { persona } = await ctx.params;
  const url = new URL(request.url);
  const next = url.searchParams.get("next");
  const target = new URL(next?.startsWith("/portal") ? next : "/portal", url);
  const response = NextResponse.redirect(target);
  if (persona in personas) {
    response.cookies.set(PERSONA_COOKIE, persona as PersonaId, { path: "/", sameSite: "lax", httpOnly: true });
  }
  return response;
}
