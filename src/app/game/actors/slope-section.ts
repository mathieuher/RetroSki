import { Actor, CollisionType, type Engine, Font, Label, Line, TextAlign, vec, Vector } from 'excalibur';
import { Config } from '../config';
import type { SlopeSectionConfig } from '../models/slope-section-config';
import type { Game } from '../game';

const SECTION_WHITE_MAX_INCLINE = 0;
const SECTION_GREEN_MAX_INCLINE = 10;
const SECTION_BLUE_MAX_INCLINE = 17;
const SECTION_RED_MAX_INCLINE = 24;

export class SlopeSection extends Actor {
    public incline: number;
    public endPosition: Vector;
    public config: SlopeSectionConfig;

    constructor(engine: Engine, startPosition: Vector, endPosition: Vector, incline: number) {
        super({
            anchor: vec(0.5, 1),
            pos: startPosition,
            width: engine.screen.resolution.width,
            height: startPosition.distance(endPosition),
            collisionType: CollisionType.Passive
        });

        this.endPosition = endPosition;
        this.incline = incline;
        this.config = SlopeSection.getSlopeSectionConfig(incline);

        // Remove snow colors and particles color regarding riders settings
        if (!(engine as Game).settingsService.getSettings().snowColors) {
            this.config.texture = Config.SLOPE_SECTION_WHITE_CONFIG.texture;
            this.config.particlesColor = Config.SLOPE_SECTION_WHITE_CONFIG.particlesColor;
        }

        this.setRotation();
        this.addBackgroundTexture();

        if (incline > 0) {
            this.drawSectionLine();
            this.drawSectionLabel();
        }
    }

    // Return the percentage of the progress for a given position on the section (0 -> 1)
    public getSectionProgress(position: Vector): number {
        return Math.abs(Math.max(this.pos.y - position.y, 0) / this.height);
    }

    public setRotation(): void {
        this.rotation = this.pos.sub(this.endPosition).toAngle() - Math.PI / 2;
    }

    private addBackgroundTexture(): void {
        const texture = this.config.texture;
        const background = texture.toSprite({
            destSize: { height: this.height, width: this.width },
            width: this.width,
            height: this.height
        });

        this.graphics.use(background);
    }

    private drawSectionLine(): void {
        const lineActor = new Actor({
            anchor: Vector.Zero,
            collisionType: CollisionType.Passive,
            height: 7,
            width: this.width
        });
        const line = new Line({
            color: this.config.dividerColor,
            thickness: lineActor.height,
            start: vec(this.pos.x - this.width / 2, 0),
            end: vec(this.pos.x + this.width / 2, 0)
        });
        lineActor.graphics.use(line);
        this.addChild(lineActor);
    }

    private drawSectionLabel(): void {
        const label = new Label({
            text: `${this.incline}°`,
            color: this.config.labelColor,
            offset: vec(0, -40),
            font: new Font({ size: 24, bold: true, textAlign: TextAlign.Center, family: 'Kode mono' }),
            collisionType: CollisionType.Passive
        });
        this.addChild(label);
    }

    public static getSlopeSectionConfig(incline: number): SlopeSectionConfig {
        if (incline === SECTION_WHITE_MAX_INCLINE) {
            return { ...Config.SLOPE_SECTION_WHITE_CONFIG };
        }
        if (incline <= SECTION_GREEN_MAX_INCLINE) {
            return { ...Config.SLOPE_SECTION_GREEN_CONFIG };
        }
        if (incline <= SECTION_BLUE_MAX_INCLINE) {
            return { ...Config.SLOPE_SECTION_BLUE_CONFIG };
        }
        if (incline <= SECTION_RED_MAX_INCLINE) {
            return { ...Config.SLOPE_SECTION_RED_CONFIG };
        }
        return { ...Config.SLOPE_SECTION_BLACK_CONFIG };
    }
}
