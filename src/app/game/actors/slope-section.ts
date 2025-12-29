import { Actor, CollisionType, type Engine, Font, Label, Line, TextAlign, toRadians, vec, Vector } from 'excalibur';
import { Config } from '../config';
import type { SlopeSectionConfig } from '../models/slope-section-config';
import type { Game } from '../game';
import { StockableSlopeSection } from '../models/stockable-slope-section';

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

    public static drawSlopeSectionsProfile(
        canvas: HTMLCanvasElement,
        width: number,
        height: number,
        slopeSections?: StockableSlopeSection[]
    ): void {
        // Define canvas size
        canvas.height = height;
        canvas.width = width;

        // Clone the sections or build an default one
        const sections = slopeSections
            ? slopeSections.filter(s => s.incline)
            : [
                  new StockableSlopeSection(
                      vec(0, 0),
                      vec(canvas.width, canvas.height),
                      Config.SLOPE_CONFIG.defaultIncline
                  )
              ];

        // Get the projected track length (X-axis without the incline)
        const projectedTrackLength = sections
            .map(s => {
                const absLength = Math.abs(s.endY - s.startY);
                return absLength * Math.cos(toRadians(s.incline));
            })
            .reduce((acc, curr) => acc + curr);

        // Registrer the start position (we're drawing from the end of the slope)
        let startPosition = vec(canvas.width, canvas.height);
        for (const section of sections.reverse()) {
            const sectionAbsLength = Math.abs(section.endY - section.startY);
            const projectedLength = sectionAbsLength * Math.cos(toRadians(section.incline));
            const lengthRatio = projectedLength / projectedTrackLength;

            const lengthX = lengthRatio * canvas.width;
            const lengthY = lengthX * Math.tan(toRadians(section.incline));

            const endX = startPosition.x - lengthX;
            const endY = startPosition.y - lengthY;

            SlopeSection.drawSlopeSection(
                vec(startPosition.x, startPosition.y),
                vec(endX, endY),
                section.incline,
                canvas
            );
            startPosition = vec(endX, endY);
        }
    }

    public static drawSlopeSection(start: Vector, end: Vector, incline: number, canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext('2d')!;

        // Draw the section polygon
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(end.x, canvas.height);
        ctx.lineTo(start.x, canvas.height);
        ctx.lineTo(start.x, start.y);
        ctx.closePath();
        ctx.fillStyle = SlopeSection.getSlopeSectionConfig(incline).profileColor.toRGBA();
        ctx.fill();

        // Draw the top line
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = SlopeSection.getSlopeSectionConfig(incline).labelColor.toRGBA();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();

        // Draw the left separation line between section (except the first on the left)
        if (end.x > 0) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = SlopeSection.getSlopeSectionConfig(incline).labelColor.toRGBA();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(end.x, canvas.height);
            ctx.closePath();
            ctx.stroke();
        }
    }
}
