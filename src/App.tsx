import { useMemo, useState } from "react";
import Matrix from "./components/Matrix";
import StepsPanel from "./components/StepsPanel";
import { buildMatrix, makePairs, normalize, transformPair, type Dir } from "./playfair";

export default function App() {
  const [key, setKey] = useState("CARIBE");
  const [msg, setMsg] = useState("Ataque al amanecer");
  const [mode, setMode] = useState<Dir>("enc");
  const [sel, setSel] = useState(0);

  const matrix = useMemo(() => buildMatrix(key), [key]);
  const keyLetters = useMemo(() => new Set(normalize(key)), [key]);
  const clean = normalize(msg);
  const pairs = useMemo(() => makePairs(clean), [clean]);

  const encSteps = useMemo(
    () => pairs.map((p) => transformPair(p.a, p.b, matrix, "enc")),
    [pairs, matrix]
  );
  const cipher = encSteps.map((s) => s.x + s.y).join("");

  const decSteps = useMemo(
    () =>
      (cipher.match(/../g) ?? []).map((p) => transformPair(p[0], p[1], matrix, "dec")),
    [cipher, matrix]
  );
  const recovered = decSteps.map((s) => s.x + s.y).join("");
  const prepared = pairs.map((p) => p.a + p.b).join("");

  const changeMode = (m: Dir) => {
    setMode(m);
    setSel(0);
  };

  return (
    <main>
      <h1>Cifrado de Playfair</h1>
      <p className="lead">
        Caso práctico: construye la matriz con una palabra clave, cifra un mensaje par por par y
        recupéralo con el procedimiento inverso.
      </p>

      <section>
        <h2>1. Matriz 5×5 con la palabra clave</h2>
        <div className="inputs">
          <div>
            <label htmlFor="k">Palabra clave</label>
            <input id="k" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="t">Mensaje original</label>
            <input
              id="t"
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
                setSel(0);
              }}
              autoComplete="off"
            />
          </div>
        </div>
        <p className="note">
          Clave normalizada: <b className="mono">{normalize(key) || "(vacía)"}</b>. Se quitan tildes,
          espacios y letras repetidas; después se completa con el resto del alfabeto. La I y la J
          comparten casilla para que el alfabeto de 26 letras quepa en 25 celdas.
        </p>
        <div style={{ marginTop: 16 }}>
          <Matrix matrix={matrix} keyLetters={keyLetters} />
        </div>
        <p className="note">Las celdas con fondo más oscuro son las letras de la clave.</p>
      </section>

      <section>
        <h2>2. Mensaje preparado en pares</h2>
        <p className="note" style={{ marginTop: 0 }}>
          Mensaje normalizado: <b className="mono">{clean || "(vacío)"}</b>
        </p>
        <div className="chips" style={{ marginTop: 12 }}>
          {pairs.map((p, i) => (
            <span key={i} className={"chip" + (p.fill ? " fill" : "")}>
              {p.a}{p.b}
            </span>
          ))}
        </div>
        <p className="note">
          Reglas: si un par tiene dos letras iguales, se inserta una X en medio; si queda una letra
          sola al final, se le agrega una X. Las X añadidas aparecen resaltadas.
        </p>
      </section>

      <section>
        <h2>3. Procedimiento par por par</h2>
        <div className="tabs">
          <button aria-pressed={mode === "enc"} onClick={() => changeMode("enc")}>Cifrar</button>
          <button aria-pressed={mode === "dec"} onClick={() => changeMode("dec")}>Descifrar</button>
        </div>
        <StepsPanel
          mode={mode}
          steps={mode === "enc" ? encSteps : decSteps}
          selected={sel}
          onSelect={setSel}
          matrix={matrix}
          keyLetters={keyLetters}
        />
      </section>

      <section>
        <h2>4. Resultado</h2>
        <dl className="sum">
          <dt>Clave</dt><dd className="mono">{normalize(key)}</dd>
          <dt>Mensaje original</dt><dd>{msg}</dd>
          <dt>Mensaje preparado</dt><dd className="mono">{pairs.map((p) => p.a + p.b).join(" ")}</dd>
          <dt>Mensaje cifrado</dt>
          <dd className="mono big"><b>{encSteps.map((s) => s.x + s.y).join(" ")}</b></dd>
          <dt>Descifrado</dt><dd className="mono">{decSteps.map((s) => s.x + s.y).join(" ")}</dd>
          <dt>Mensaje recuperado</dt><dd className="mono">{recovered}</dd>
        </dl>
        <p className="note">
          {recovered === prepared
            ? "El descifrado coincide con el mensaje preparado. Para leerlo, se quitan las X de relleno y se separan las palabras."
            : "El descifrado no coincide con el mensaje preparado."}
        </p>
      </section>
    </main>
  );
}
