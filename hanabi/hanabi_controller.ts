// @ts-types="@types/p5"
import p5 from "https://esm.sh/p5@1.10.0";
import { Firework } from "./firework.ts";
import { HanabiMode } from "./mode_type.ts";

export class HanabiController {
  private _isReady = false;
  private _currentMode: HanabiMode | null = null;
  private _fireworks: Firework[] = [];

  constructor() {}

  get isReady() {
    return this._isReady;
  }

  start(mode: HanabiMode) {
    this._isReady = true;
    this._currentMode = mode;
  }

  update(firework: Firework | null) {
    if (firework == null) return;

    switch (this._currentMode) {
      case HanabiMode.Make:
        return this._updateSingleFirework(firework);
      case HanabiMode.Contest:
        return this._updateContestFirework(firework);
    }
  }

  draw(p: p5, dt: number) {
    for (let i = this._fireworks.length - 1; i >= 0; i--) {
      // フレームレートを考慮して更新をかける
      this._fireworks[i].update(p, dt);
      this._fireworks[i].show();
      if (this._fireworks[i].done) {
        this._fireworks[i].dispose();
        this._fireworks.splice(i, 1);
      }
    }
  }

  _updateSingleFirework(firework: Firework) {
    if (this._fireworks.length === 0) {
      this._fireworks.push(firework);
    }
  }

  _updateContestFirework(firework: Firework) {
    this._fireworks.push(firework);
  }
}
