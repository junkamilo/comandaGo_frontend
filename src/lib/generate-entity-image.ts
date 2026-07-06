const PALETTE = [
  "#c2410c",
  "#b45309",
  "#15803d",
  "#0369a1",
  "#7c3aed",
  "#be123c",
  "#0f766e",
  "#a16207",
];

function hashNombre(nombre: string): number {
  let hash = 0;
  for (let i = 0; i < nombre.length; i += 1) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function truncarLineas(nombre: string, maxPorLinea: number, maxLineas: number): string[] {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return ["?"];

  const lineas: string[] = [];
  let actual = "";

  for (const palabra of palabras) {
    const candidato = actual ? `${actual} ${palabra}` : palabra;
    if (candidato.length <= maxPorLinea) {
      actual = candidato;
    } else {
      if (actual) lineas.push(actual);
      actual = palabra.length > maxPorLinea ? `${palabra.slice(0, maxPorLinea - 1)}…` : palabra;
      if (lineas.length >= maxLineas) break;
    }
  }

  if (actual && lineas.length < maxLineas) {
    lineas.push(actual);
  }

  return lineas.slice(0, maxLineas);
}

export function generarImagenPlaceholder(nombre: string): string {
  const color = PALETTE[hashNombre(nombre) % PALETTE.length];
  const lineas = truncarLineas(nombre, 14, 2);
  const lineHeight = 22;
  const startY = 56 - ((lineas.length - 1) * lineHeight) / 2;

  const textElements = lineas
    .map(
      (linea, index) =>
        `<text x="50%" y="${startY + index * lineHeight}" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="16" font-weight="600">${escapeXml(linea)}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112"><rect width="112" height="112" rx="12" fill="${color}"/>${textElements}</svg>`;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
