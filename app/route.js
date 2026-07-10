import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(readFileSync(join(process.cwd(), "landing.html"), "utf-8"), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
