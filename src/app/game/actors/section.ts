import {
    Actor,
    CollisionType,
    Color,
    type Engine,
    Font,
    type ImageSource,
    Label,
    Line,
    TextAlign,
    Vector
} from 'excalibur';
import { Resources } from '../resources';
import { Config } from '../config';

export class Section extends Actor {
    public steep: number;

    constructor(engine: Engine, startPosition: Vector, length: number, steep: number) {
        super({
            anchor: new Vector(0.5, 1),
            pos: startPosition,
            width: engine.screen.resolution.width,
            height: length,
            collisionType: CollisionType.Passive
        });

        this.steep = steep;

        this.defineBackgroundTexture();

        if (steep > 0) {
            this.drawSectionLine();
            this.drawSectionInclineLabel();
        }
    }

    public get endPosition(): Vector {
        return new Vector(this.pos.x, this.pos.y - this.height);
    }

    private defineBackgroundTexture(): void {
        const background = Section.getSlopeTexture(this.steep);
        const backgroundSprite = background.toSprite({
            destSize: { height: this.height, width: this.width },
            width: this.width,
            height: this.height
        });

        this.graphics.use(backgroundSprite);
    }

    private drawSectionLine(): void {
        // Add a line to the start of the section
        const lineActor = new Actor({
            anchor: Vector.Zero,
            collisionType: CollisionType.Passive,
            height: 7,
            width: this.width
            // opacity: 0.1,
            // offset: new Vector(0, 10)
        });
        const line = new Line({
            color: Section.getSlopeAlphaColor(this.steep),
            thickness: lineActor.height,
            start: new Vector(this.pos.x - this.width / 2, 0),
            end: new Vector(this.pos.x + this.width / 2, 0)
        });
        lineActor.graphics.use(line);
        this.addChild(lineActor);
    }

    private drawSectionInclineLabel(): void {
        const label = new Label({
            text: `${this.steep}°`,
            color: Section.getSlopeColor(this.steep),
            offset: new Vector(0, -32),
            font: new Font({ size: 24, bold: true, textAlign: TextAlign.Center, family: 'Kode mono' }),
            opacity: 0.4,
            collisionType: CollisionType.Passive
        });

        this.addChild(label);
    }

    public static getSlopeTexture(steep: number): ImageSource {
        return steep === 0
            ? Resources.SnowTexture
            : steep <= 15
              ? Resources.SnowTexture15
              : steep <= 25
                ? Resources.SnowTexture25
                : Resources.SnowTexture35;
    }

    public static getSlopeColor(steep: number): Color {
        return steep === 0 ? Color.Gray : steep <= 15 ? Color.Blue : steep <= 25 ? Color.Orange : Color.Red;
    }

    public static getSlopeAlphaColor(steep: number): Color {
        return steep <= 15
            ? Color.fromHex(Config.TRACK_SLOPE_15_COLOR)
            : steep <= 25
              ? Color.fromHex(Config.TRACK_SLOPE_25_COLOR)
              : Color.fromHex(Config.TRACK_SLOPE_35_COLOR);
    }
}
