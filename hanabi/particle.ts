// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";

export abstract class AbstractParticle {
  position: p5.Vector;
  abstract velocity: p5.Vector;
  abstract acceleration: p5.Vector;
  abstract radius: number;
  abstract color: p5.Color;
  graphicBuffer;

  constructor(pos: p5.Vector, graphicBuffer: p5.Graphics) {
    this.position = pos;

    this.graphicBuffer = graphicBuffer;
  }

  update(delta: number) {
    this.velocity.add(this.acceleration.copy().mult(delta));
    this.position.add(this.velocity.copy().mult(delta));
  }

  draw() {
    this.graphicBuffer.strokeWeight(this.radius);
    this.graphicBuffer.stroke(this.color);
    this.graphicBuffer.point(this.position.x, this.position.y);
  }
}

export class RasingParticle extends AbstractParticle {
  velocity: p5.Vector;
  acceleration: p5.Vector;
  radius: number;
  color: p5.Color;

  constructor(
    p: p5,
    graphicBuffer: p5.Graphics,
    pos: p5.Vector,
    color: p5.Color
  ) {
    super(pos, graphicBuffer);
    this.velocity = p.createVector(0, p.random(2, 3) * -3);
    this.acceleration = p.createVector(0, 0.1);
    this.color = color;
    this.radius = 6;
  }
}

export class ExplodeParticle extends AbstractParticle {
  velocity: p5.Vector;
  acceleration: p5.Vector;
  radius: number;
  color: p5.Color;
  #lifespan;
  #velocityDist: number;
  #initLife;

  constructor(
    graphicBuffer: p5.Graphics,
    pos: p5.Vector,
    color: p5.Color,
    r: number,
    v: number,
    initLife: number,
    v0: p5.Vector,
    acc: p5.Vector
  ) {
    super(pos, graphicBuffer);
    this.velocity = v0;
    this.acceleration = acc;

    this.color = color;
    this.radius = r;
    this.#initLife = initLife;
    this.#lifespan = initLife;

    this.#velocityDist = v;
  }

  update(delta: number) {
    super.update(delta);

    this.velocity.mult(this.#velocityDist * delta);
    this.#lifespan -= delta * 4.0;

    // 最後は光がだんだん消えていくように
    if (this.#lifespan < this.#initLife * 0.2) {
      this.radius *= 0.9;
    }
  }

  get done() {
    return this.#lifespan < 0;
  }
}
