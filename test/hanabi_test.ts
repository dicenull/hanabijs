import { Firework } from "../hanabi/firework.ts";
// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";

Deno.test("花火を生成", () => {
  const p = new p5(() => {});
  const firework = new Firework(
    p,
    [p.color(255, 255, 255)],
    ["菊"],
    [],
    p.createVector(0, 0)
  );

  // TODO: assert
});
