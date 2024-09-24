/// <reference lib="DOM" />
// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";

import { Firework } from "./firework.ts";
import { HanabiType } from "./hanabi_type.ts";

const fireworks: Firework[] = [];
let bgColor: p5.Color;

let graphicBuffers: p5.Graphics[] = [];
const raisingTrail = 15;
const kikuTrail = 30;
const botanTrail = 3;
const standardFrame = 60;

function FireworkMakeMode(p: p5) {
  if (fireworks.length === 0) {
    const launchPos = p.createVector(
      p.random(p.width * 0.4, p.width * 0.6),
      p.height,
    );
    const firework = new Firework(
      p,
      firework_colors,
      firework_types,
      graphicBuffers,
      launchPos,
    );

    fireworks.push(firework);
  }
}

function FireworkContestMode(p: p5) {
  if (p.random() < 0.3) {
    const _type = (): HanabiType => p.random(["Botan", "Kiku"]);
    const _color = () => p.color(p.random(255), 255, 255);

    const firework = new Firework(
      p,
      [_color(), _color(), _color()],
      [_type(), _type(), _type()],
      graphicBuffers,
      p.createVector(p.random(0.1, 0.9) * p.width, p.height),
    );

    fireworks.push(firework);
  }
}

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

    graphicBuffers = [
      p.createGraphics(p.width, p.height),
      p.createGraphics(p.width, p.height),
      p.createGraphics(p.width, p.height),
    ];

    p.frameRate(standardFrame);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, (p.windowHeight * 4) / 5);
  };

  p.draw = () => {
    p.colorMode(p.RGB); // 花火を出す色の指定の仕方
    p.background(bgColor); // 背景に少し透明なのを重ねてだんだん消えて行くように
    p.colorMode(p.HSB);

    if (isReady) {
      if (mode === "make") {
        FireworkMakeMode(p);
      } else if (mode === "contest") {
        FireworkContestMode(p);
      }

      // 花火の更新
      graphicBuffers[0].background(0, Math.ceil(255 / raisingTrail));
      graphicBuffers[1].background(0, Math.ceil(255 / botanTrail));
      graphicBuffers[2].background(0, Math.ceil(255 / kikuTrail));

      const delta = p.deltaTime;
      const currentFrame = p.frameRate();
      for (let i = fireworks.length - 1; i >= 0; i--) {
        // フレームレートを考慮して更新をかける
        fireworks[i].update(p, delta * currentFrame * 0.001);
        fireworks[i].show();
        if (fireworks[i].done) {
          fireworks[i].dispose();
          fireworks.splice(i, 1);
        }
      }

      // canvasに反映
      p.blendMode(p.SCREEN);
      for (let i = 0; i < graphicBuffers.length; i++) {
        graphicBuffers[i].background(0, 1);

        p.image(graphicBuffers[i], 0, 0);
      }
      p.blendMode(p.BLEND);
    }
  };
};

let isReady = false;
let firework_types: HanabiType[];
let firework_colors: p5.Color[];
let mode: string;

function start(_mode: string) {
  isReady = true;
  mode = _mode;
}

export function startMakeMode(types: HanabiType[], colors: p5.Color[]) {
  start("make");

  firework_types = types;
  firework_colors = colors;
}

export function startContestMode() {
  start("contest");
}

new p5(sketch);
