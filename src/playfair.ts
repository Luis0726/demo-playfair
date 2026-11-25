export type Rule = "row" | "col" | "rect";
export type Dir = "enc" | "dec";

export interface Pair {
  a: string;
  b: string;
  /** "dup": letras iguales (se inserta X). "pad": letra sola al final. */
  fill: "dup" | "pad" | null;
}

export interface Step {
  a: string;
  b: string;
  ia: number; // índice en la matriz de la letra de entrada a
  ib: number;
  oa: number; // índice en la matriz de la letra de salida
  ob: number;
  rule: Rule;
  x: string; // letra de salida
  y: string;
}

const ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // sin J

/** Mayúsculas, sin tildes ni símbolos, y J -> I. */
export const normalize = (s: string): string =>
  s
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "")
    .replace(/J/g, "I");

/** Matriz 5x5 aplanada (25 letras): clave sin repetir + resto del alfabeto. */
export function buildMatrix(key: string): string[] {
  const seen = new Set<string>();
  const matrix: string[] = [];
  for (const c of normalize(key) + ALPHABET) {
    if (!seen.has(c)) {
      seen.add(c);
      matrix.push(c);
    }
  }
  return matrix;
}

/** Divide el mensaje en dígrafos aplicando las reglas de relleno con X. */
export function makePairs(text: string): Pair[] {
  const pairs: Pair[] = [];
  let i = 0;
  while (i < text.length) {
    const a = text[i];
    const b = text[i + 1];
    const filler = a === "X" ? "Z" : "X";
    if (b === undefined) {
      pairs.push({ a, b: filler, fill: "pad" });
      i += 1;
    } else if (a === b) {
      pairs.push({ a, b: filler, fill: "dup" });
      i += 1;
    } else {
      pairs.push({ a, b, fill: null });
      i += 2;
    }
  }
  return pairs;
}

/** Cifra (dir = "enc") o descifra (dir = "dec") un par de letras. */
export function transformPair(a: string, b: string, m: string[], dir: Dir): Step {
  const d = dir === "enc" ? 1 : 4; // +1 y -1 (mod 5)
  const ia = m.indexOf(a);
  const ib = m.indexOf(b);
  const ra = Math.floor(ia / 5), ca = ia % 5;
  const rb = Math.floor(ib / 5), cb = ib % 5;
  let oa: number, ob: number, rule: Rule;

  if (ra === rb) {
    rule = "row";
    oa = ra * 5 + ((ca + d) % 5);
    ob = rb * 5 + ((cb + d) % 5);
  } else if (ca === cb) {
    rule = "col";
    oa = ((ra + d) % 5) * 5 + ca;
    ob = ((rb + d) % 5) * 5 + cb;
  } else {
    rule = "rect";
    oa = ra * 5 + cb;
    ob = rb * 5 + ca;
  }
  return { a, b, ia, ib, oa, ob, rule, x: m[oa], y: m[ob] };
}

/** Posición (fila, columna) en base 1. */
export const pos = (i: number): string =>
  `(${Math.floor(i / 5) + 1},${(i % 5) + 1})`;

export const RULE_NAME: Record<Rule, string> = {
  row: "Misma fila",
  col: "Misma columna",
  rect: "Rectángulo",
};

export function explain(s: Step, dir: Dir): string {
  const enc = dir === "enc";
  if (s.rule === "row")
    return `Las dos letras están en la misma fila. Cada una se reemplaza por la letra de su ${
      enc ? "derecha" : "izquierda"
    } (si está al borde, se vuelve al otro extremo de la fila).`;
  if (s.rule === "col")
    return `Las dos letras están en la misma columna. Cada una se reemplaza por la letra de ${
      enc ? "abajo" : "arriba"
    } (si está al borde, se vuelve al otro extremo de la columna).`;
  return "Las letras forman un rectángulo. Cada una se reemplaza por la letra de su propia fila ubicada en la columna de la otra letra.";
}
