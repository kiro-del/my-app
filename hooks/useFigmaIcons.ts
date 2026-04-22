"use client";

// hooks/useFigmaIcons.ts
// Batch-fetches Figma icon SVG URLs from the /api/figma-icons proxy.
// Uses a module-level cache so each nodeId is only fetched once per session.

import { useState, useEffect } from "react";

const FILE_KEY = "j8hy0yzSKPyh1yRKOh4tuU";
const _cache: Record<string, string> = {};

/**
 * Accepts an array of Figma nodeIds (e.g. "94:553").
 * Returns a map of nodeId → SVG URL. Entries appear as they resolve.
 * All nodeIds are fetched in a single API call.
 */
export function useFigmaIcons(nodeIds: string[]): Record<string, string> {
  const idsKey = [...nodeIds].sort().join(",");

  // Always start empty so server and client render the same initial (fallback) state,
  // preventing hydration mismatches. Cache is applied client-side in the effect below.
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    // Apply any already-cached entries immediately (client-only)
    const cached: Record<string, string> = {};
    nodeIds.forEach((id) => { if (_cache[id]) cached[id] = _cache[id]; });
    if (Object.keys(cached).length > 0) setUrls(cached);

    const missing = nodeIds.filter((id) => !_cache[id]);
    if (missing.length === 0) return;

    const ids = missing.map((id) => id.replace(":", "-")).join(",");
    fetch(`/api/figma-icons?ids=${encodeURIComponent(ids)}&fileKey=${FILE_KEY}`)
      .then((r) => r.json())
      .then((json: { images?: Record<string, string> }) => {
        const images = json.images ?? {};
        const newUrls: Record<string, string> = {};
        missing.forEach((id) => {
          // Figma API returns keys with colons (e.g. "216:1202")
          if (images[id]) {
            _cache[id] = images[id];
            newUrls[id] = images[id];
          }
        });
        if (Object.keys(newUrls).length > 0) {
          setUrls((prev) => ({ ...prev, ...newUrls }));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return urls;
}
