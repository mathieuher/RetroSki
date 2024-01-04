import { Actor, Color, Engine, vec } from "excalibur";

export class Player extends Actor {

  public speed = 0;

  constructor(engine: Engine) {
    super({
      pos: engine.worldToScreenCoordinates(vec(0, 0)),
      width: 20,
      height: 20,
      color: Color.Red
    });
  }

  onInitialize() {
  }


}
