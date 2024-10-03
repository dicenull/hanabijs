/// <reference lib="DOM" />
// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";

import { HanabiType } from "./hanabi_type.ts";
import { ExplodeParticle, RasingParticle, Rigidbody } from "./particle.ts";

const onFireworkExplode = new CustomEvent("onFireworkExplode");

const onFireworkDispose = new CustomEvent("onFireworkDispose");

export function kikuParticle(
  p: p5,
  origin: p5.Vector,
  vec: p5.Vector,
  color: p5.Color,
) {
  return new ExplodeParticle(
    "Kiku",
    color,
    p.random() < 0.5 ? 3 : 1,
    0.98,
    250,
    new Rigidbody(origin, vec.mult(5), p.createVector(0, 0.04)),
  );
}

export function botanParticle(
  p: p5,
  origin: p5.Vector,
  vec: p5.Vector,
  color: p5.Color,
) {
  return new ExplodeParticle(
    "Botan",
    color,
    p.random(5, 8),
    0.93,
    300,
    new Rigidbody(origin, vec.mult(6), p.createVector(0, 0)),
  );
}

export class Firework {
  colors;
  types;
  rasingParticle;
  exploded = false;
  particles: ExplodeParticle[] = [];
  buffers;

  constructor(
    p: p5,
    colors: p5.Color[],
    types: HanabiType[],
    buffers: Record<HanabiType, p5.Graphics | null>,
    launch: p5.Vector,
  ) {
    this.buffers = buffers;
    this.colors = colors;
    this.types = types;

    this.rasingParticle = new RasingParticle(p, launch, this.colors[0]);
  }

  explode(p: p5) {
    let fireworkSum = 0;
    for (let i = 0; i < this.types.length; i++) {
      if (this.types[i] === "Botan") {
        fireworkSum += 50;
      }
      if (this.types[i] === "Kiku") {
        fireworkSum += 100;
      }
    }

    const rPos = this.rasingParticle.rb.position;
    for (let i = 0; i < fireworkSum; i++) {
      const vec = p5.Vector.random3D();
      const type = this.selectType(vec);
      const particleColor = this.selectColor(vec);
      const origin = p.createVector(rPos.x, rPos.y);

      if (type === "Botan") {
        this.particles.push(botanParticle(p, origin, vec, particleColor));
      }
      if (type === "Kiku") {
        this.particles.push(kikuParticle(p, origin, vec, particleColor));
      }
    }
  }

  dispose() {
    document.dispatchEvent(onFireworkDispose);
  }

  // 花火が打ち上がったのかをチェックする関数
  get done() {
    return this.exploded && this.particles.length === 0;
  }

  // 花火が打ち上がったらどのように落ちて行くのかを設定
  update(p: p5, dt: number) {
    if (!this.exploded) {
      this.rasingParticle.update(dt);
      if (this.rasingParticle.rb.velocity.y >= 0) {
        document.dispatchEvent(onFireworkExplode);
        this.exploded = true;
        this.explode(p);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].done) {
        this.particles.splice(i, 1);
      }
    }
  }

  show() {
    if (!this.exploded) {
      this.rasingParticle.draw(this.buffers["Rasing"]!);
    }
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.draw(this.buffers[p.type]!);
    }
  }

  // 花火の重心によって花火の種類を選択する。中心に近いほど0
  selectIndex(vector: p5.Vector) {
    const xyMag = vector.x * vector.x + vector.y * vector.y;
    if (xyMag < 0.3) {
      return 0;
    } else if (xyMag < 0.6) {
      return 1;
    } else {
      return 2;
    }
  }

  selectType(vector: p5.Vector) {
    return this.types[this.selectIndex(vector)];
  }

  selectColor(vector: p5.Vector) {
    return this.colors[this.selectIndex(vector)];
  }
}
