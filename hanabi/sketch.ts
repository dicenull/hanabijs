/// <reference lib="DOM" />
// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";

import {
  HanabiBuilder,
  MakeRandomFirework,
  MakeSingleFirework,
} from "./hanabi_builder.ts";
import { HanabiController } from "./hanabi_controller.ts";
import { HanabiType, isHanabiType } from "./hanabi_type.ts";
import { HanabiMode } from "./mode_type.ts";

const hanabiController = new HanabiController();
let hanabiBuilder: HanabiBuilder | null = null;
let bgColor: p5.Color;

const graphicBuffers: Record<HanabiType, p5.Graphics | null> = {
  Kiku: null,
  Botan: null,
  Rasing: null,
};
const raisingTrail = 15;
const kikuTrail = 30;
const botanTrail = 3;
const standardFrame = 60;

const sketch = (p: p5) => {
  p.setup = () => {
    const result = document.getElementById("canvas");
    const canvas = p.createCanvas(p.windowWidth, (p.windowHeight * 4) / 5); // canvasを作成
    canvas.parent(result!);

    bgColor = p.color(34, 34, 51);

    p.background(bgColor); // 背景を黒く指定
    p.colorMode(p.HSB); //花火を出す色の指定の仕方
    p.stroke(255); // 線の色を設定
    p.strokeWeight(4); // 線の太さ

    Object.keys(graphicBuffers)
      .filter(isHanabiType)
      .forEach((key) => {
        graphicBuffers[key] = p.createGraphics(p.width, p.height);
      });

    p.frameRate(standardFrame);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, (p.windowHeight * 4) / 5);
  };

  p.draw = () => {
    p.colorMode(p.RGB); // 花火を出す色の指定の仕方
    p.background(bgColor); // 背景に少し透明なのを重ねてだんだん消えて行くように
    p.colorMode(p.HSB);

    if (hanabiController.isReady) {
      const nextFirework = hanabiBuilder?.build(p, graphicBuffers) ?? null;
      hanabiController.update(nextFirework);

      // 花火の更新
      graphicBuffers["Rasing"]?.background(0, Math.ceil(255 / raisingTrail));
      graphicBuffers["Botan"]?.background(0, Math.ceil(255 / botanTrail));
      graphicBuffers["Kiku"]?.background(0, Math.ceil(255 / kikuTrail));

      const delta = p.deltaTime;
      const currentFrame = p.frameRate();
      hanabiController.draw(p, delta * currentFrame * 0.001);

      // canvasに反映
      p.blendMode(p.SCREEN);
      Object.keys(graphicBuffers)
        .filter(isHanabiType)
        .forEach((key) => {
          graphicBuffers[key]?.background(0, 1);

          p.image(graphicBuffers[key]!, 0, 0);
        });

      p.blendMode(p.BLEND);
    }
  };
};

export function startMakeMode(types: HanabiType[], colors: p5.Color[]) {
  hanabiBuilder = new MakeSingleFirework(colors, types);
  hanabiController.start(HanabiMode.Make);
}

export function startContestMode() {
  hanabiBuilder = new MakeRandomFirework();
  hanabiController.start(HanabiMode.Contest);
}

new p5(sketch);
