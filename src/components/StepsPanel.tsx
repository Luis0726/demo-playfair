import { explain, pos, RULE_NAME, type Dir, type Step } from "../playfair";
import Matrix from "./Matrix";

interface Props {
  mode: Dir;
  steps: Step[];
  selected: number;
  onSelect: (i: number) => void;
  matrix: string[];
  keyLetters: Set<string>;
}

export default function StepsPanel({ mode, steps, selected, onSelect, matrix, keyLetters }: Props) {
  if (!steps.length) return <p className="note">Escribe un mensaje para ver los pasos.</p>;

  const idx = Math.min(selected, steps.length - 1);
  const cur = steps[idx];
  const enc = mode === "enc";

  return (
    <div className="split">
      <div>
        <Matrix matrix={matrix} keyLetters={keyLetters} step={cur} />
        <div className="legend">
          <span><i style={{ background: "var(--row)" }} />Fila</span>
          <span><i style={{ background: "var(--col)" }} />Columna</span>
          <span><i style={{ background: "var(--rect)" }} />Rectángulo</span>
        </div>
        <p className="note">Borde grueso: letras de entrada. Relleno: letras de salida.</p>
      </div>

      <div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Par</th>
                <th>Posiciones</th>
                <th>Regla</th>
                <th>{enc ? "Cifrado" : "Descifrado"}</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} className={`r-${s.rule}${i === idx ? " sel" : ""}`}>
                  <td>
                    <button onClick={() => onSelect(i)} aria-label={`Ver par ${s.a}${s.b}`}>
                      {s.a}{s.b}
                    </button>
                  </td>
                  <td className="mono">{s.a}{pos(s.ia)} {s.b}{pos(s.ib)}</td>
                  <td>{RULE_NAME[s.rule]}</td>
                  <td className="mono"><b>{s.x}{s.y}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`why r-${cur.rule}`}>
          <b className="mono">{cur.a}{cur.b} → {cur.x}{cur.y}</b>
          <br />
          {explain(cur, mode)}
          <div className="note">
            {cur.a} en {pos(cur.ia)} pasa a {cur.x} en {pos(cur.oa)}; {cur.b} en {pos(cur.ib)} pasa a{" "}
            {cur.y} en {pos(cur.ob)}. Posición = (fila, columna).
          </div>
        </div>
      </div>
    </div>
  );
}
