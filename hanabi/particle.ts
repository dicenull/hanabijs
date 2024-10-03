// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";
import { HanabiType } from "./hanabi_type.ts";

export class Rigidbody {
  constructor(
    public position: p5.Vector,
    public velocity: p5.Vector,
    public acceleration: p5.Vector
  ) {}
}

export abstract class AbstractParticle {
  rb: Rigidbody;
  abstract radius: number;
  abstract color: p5.Color;

  constructor(rigidbody: Rigidbody, public type: HanabiType) {
    this.rb = rigidbody;
  }

  update(delta: number) {
    this.rb.velocity.add(this.rb.acceleration.copy().mult(delta));
    this.rb.position.add(this.rb.velocity.copy().mult(delta));
  }

  draw(graphicBuffer: p5.Graphics) {
    graphicBuffer.strokeWeight(this.radius);
    graphicBuffer.stroke(this.color);
    graphicBuffer.point(this.rb.position.x, this.rb.position.y);
  }
}

export class RasingParticle extends AbstractParticle {
  radius: number;
  color: p5.Color;

  constructor(p: p5, pos: p5.Vector, color: p5.Color) {
    super(
      new Rigidbody(
        pos,
        p.createVector(0, p.random(2, 3) * -3),
        p.createVector(0, 0.1)
      ),
      "Rasing"
    );

    this.color = color;
    this.radius = 6;
  }
}

export class ExplodeParticle extends AbstractParticle {
  radius: number;
  color: p5.Color;
  #lifespan;
  #velocityDist: number;
  #initLife;

  constructor(
    type: HanabiType,
    color: p5.Color,
    r: number,
    v: number,
    initLife: number,
    rigidbody: Rigidbody
  ) {
    super(rigidbody, type);

    this.color = color;
    this.radius = r;
    this.#initLife = initLife;
    this.#lifespan = initLife;

    this.#velocityDist = v;
  }

  update(delta: number) {
    super.update(delta);

    this.rb.velocity.mult(this.#velocityDist * delta);
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
