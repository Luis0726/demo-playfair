import type { Step } from "../playfair";

interface Props {
  matrix: string[];
  keyLetters: Set<string>;
  step?: Step | null;
}

export default function Matrix({ matrix, keyLetters, step }: Props) {
  return (
    <div
      className={"mx" + (step ? ` r-${step.rule}` : "")}
      role="grid"
      aria-label="Matriz Playfair 5 por 5"
    >
      {matrix.map((ch, i) => {
        const cls = ["c"];
        if (keyLetters.has(ch)) cls.push("kw");
        if (step && (i === step.ia || i === step.ib)) cls.push("src");
        if (step && (i === step.oa || i === step.ob)) cls.push("res");
        return (
          <div key={i} role="gridcell" className={cls.join(" ")}>
            {ch}
          </div>
        );
      })}
    </div>
  );
}
