/** Default min-widths aligned with MUI’s default theme breakpoints. */
const DEFAULT_BREAKPOINT_MIN_PX: Record<string, number> = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

function resolveMinWidths(keys: string[]): { key: string; minPx: number }[] {
  const unknown = keys.filter((k) => !(k in DEFAULT_BREAKPOINT_MIN_PX));
  unknown.sort((a, b) => a.localeCompare(b));
  return keys.map((key) => ({
    key,
    minPx:
      key in DEFAULT_BREAKPOINT_MIN_PX
        ? DEFAULT_BREAKPOINT_MIN_PX[key]
        : 2000 + unknown.indexOf(key) * 400,
  }));
}

function selector(scopeId: string, bp: string): string {
  return `[data-adaptive-mosaic="${scopeId}"][data-mosaic-bp="${bp}"]`;
}

/**
 * Emulates MUI `sx` responsive `display` for one wrapper per breakpoint:
 * only the matching range shows `block`, others `none`.
 */
export function buildBreakpointVisibilityCss(
  scopeId: string,
  breakpointKeys: string[],
): string {
  if (breakpointKeys.length === 0) return "";

  const items = resolveMinWidths(breakpointKeys).sort(
    (a, b) => a.minPx - b.minPx || a.key.localeCompare(b.key),
  );

  const rules: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const { key, minPx } = items[i];
    const sel = selector(scopeId, key);
    const next = items[i + 1];

    if (items.length === 1) {
      if (minPx === 0) {
        rules.push(`${sel}{display:block;}`);
      } else {
        rules.push(`${sel}{display:none;}`);
        rules.push(`@media (min-width:${minPx}px){${sel}{display:block;}}`);
      }
      continue;
    }

    if (i === 0) {
      if (minPx === 0) {
        rules.push(`${sel}{display:block;}`);
        if (next) {
          rules.push(
            `@media (min-width:${next.minPx}px){${sel}{display:none;}}`,
          );
        }
      } else {
        rules.push(`${sel}{display:none;}`);
        rules.push(`@media (min-width:${minPx}px){${sel}{display:block;}}`);
        if (next) {
          rules.push(
            `@media (min-width:${next.minPx}px){${sel}{display:none;}}`,
          );
        }
      }
      continue;
    }

    if (!next) {
      rules.push(`${sel}{display:none;}`);
      rules.push(`@media (min-width:${minPx}px){${sel}{display:block;}}`);
      continue;
    }

    rules.push(`${sel}{display:none;}`);
    rules.push(`@media (min-width:${minPx}px){${sel}{display:block;}}`);
    rules.push(`@media (min-width:${next.minPx}px){${sel}{display:none;}}`);
  }

  return rules.join("");
}
