// app/api/figma-icons/route.ts
// Proxies Figma image export API so we don't expose the token client-side.
// Add FIGMA_TOKEN to your .env.local file.

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids     = searchParams.get("ids");
  const fileKey = searchParams.get("fileKey");

  if (!ids || !fileKey) {
    return NextResponse.json({ error: "Missing ids or fileKey" }, { status: 400 });
  }

  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "FIGMA_TOKEN not set in .env.local" },
      { status: 500 }
    );
  }

  // Figma export API needs node IDs with colons e.g. "46:2936"
  // The client sends them with dashes e.g. "46-2936" to avoid URL issues
  // so we convert back here
  const figmaIds = ids.replace(/-(\d)/g, ":$1");

  try {
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(figmaIds)}&format=svg`;
    const res = await fetch(url, {
      headers: { "X-Figma-Token": token },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data: { err?: string | null; images?: Record<string, string> } = await res.json();
    const s3Images = data.images ?? {};

    // Figma's S3 export URLs lack CORS headers, so mask-image: url(s3url) is blocked
    // by the browser. Fix: fetch each SVG server-side and return a data: URL instead.
    const dataImages: Record<string, string> = {};
    await Promise.all(
      Object.entries(s3Images).map(async ([nodeId, s3Url]) => {
        try {
          const svgRes = await fetch(s3Url);
          if (svgRes.ok) {
            const svgText = await svgRes.text();
            const b64 = Buffer.from(svgText).toString("base64");
            dataImages[nodeId] = `data:image/svg+xml;base64,${b64}`;
          } else {
            dataImages[nodeId] = s3Url; // fall back to direct URL
          }
        } catch {
          dataImages[nodeId] = s3Url;
        }
      })
    );

    return NextResponse.json({ err: data.err ?? null, images: dataImages });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
