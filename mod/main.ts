// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";

export function registerHanabi() {
  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(720, 400);
    };

    p.draw = () => {
      if (p.mouseIsPressed) {
        p.fill(0);
      } else {
        p.fill(255);
      }
      p.circle(p.mouseX, p.mouseY, 100);
    };
  };
  new p5(sketch);
}
