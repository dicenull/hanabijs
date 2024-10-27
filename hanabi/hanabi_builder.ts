// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";
import { Firework } from "./firework.ts";
import { HanabiType } from "./hanabi_type.ts";

export interface HanabiBuilder {
  build(
    p: p5,
    graphicBuffers: Record<HanabiType, p5.Graphics | null>,
  ): Firework | null;
}

export class MakeSingleFirework implements HanabiBuilder {
  constructor(
    private firework_colors: p5.Color[],
    private firework_types: HanabiType[],
  ) {}

  build(
    p: p5,
    graphicBuffers: Record<HanabiType, p5.Graphics | null>,
  ): Firework {
    const launchPos = p.createVector(
      p.random(p.width * 0.4, p.width * 0.6),
      p.height,
    );
    return new Firework(
      p,
      this.firework_colors,
      this.firework_types,
      graphicBuffers,
      launchPos,
    );
  }
}
export class MakeRandomFirework implements HanabiBuilder {
  build(
    p: p5,
    graphicBuffers: Record<HanabiType, p5.Graphics | null>,
  ): Firework | null {
    const isLaunch = p.random() < 0.3;
    if (!isLaunch) return null;

    const _type = (): HanabiType => p.random(["Botan", "Kiku"]);
    const _color = () => p.color(p.random(255), 255, 255);

    return new Firework(
      p,
      [_color(), _color(), _color()],
      [_type(), _type(), _type()],
      graphicBuffers,
      p.createVector(p.random(0.1, 0.9) * p.width, p.height),
    );
  }
}
