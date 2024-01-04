import { Actor, Color, Engine, Keys, vec } from "excalibur";
import { Config } from "./config";

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

  update(engine: Engine, delta: number): void {
    if (engine.input.keyboard.isHeld(Keys.ArrowLeft)) {
      this.carving('left');
    } else if (engine.input.keyboard.isHeld(Keys.ArrowRight)) {
      this.carving('right');
    }
  }

  private carving(orientation: 'left' | 'right'): void {
    if (orientation === 'left') {
      this.vel.x -= this.vel.x > 0 ? Config.CARVING_INVERTER_VELOCITY * Config.CARVING_LATERAL_VELOCITY : Config.CARVING_LATERAL_VELOCITY;
    } else {
      this.vel.x += this.vel.x < 0 ? Config.CARVING_INVERTER_VELOCITY * Config.CARVING_LATERAL_VELOCITY : Config.CARVING_LATERAL_VELOCITY;
    }
  }
}
