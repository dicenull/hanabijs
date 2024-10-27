import { HanabiMode } from "./mode_type.ts";

export class HanabiController {
  isReady = false;
  public currentMode: HanabiMode | null = null;

  constructor() {}

  start(mode: HanabiMode) {
    this.isReady = true;
    this.currentMode = mode;
  }
}
