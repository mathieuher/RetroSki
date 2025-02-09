import { Config } from '../config';
import { Track } from '../models/track';
import type { StockableTrack } from '../models/stockable-track';
import { TrackStyles } from '../models/track-styles.enum';
import type { GatesConfig } from '../models/gates-config';
import { type Pivot, StockableGate } from '../models/stockable-gate';
import { StockableDecoration } from '../models/stockable-decoration';

export class TrackBuilder {
    /**
     * Design a new track
     * @param name name of the track
     * @param trackStyle style of the track
     * @returns new track
     */
    public static designTrack(name: string, trackStyle: TrackStyles): Track {
        const gatesConfig = TrackBuilder.getGatesConfig(trackStyle);
        const numberOfGates = TrackBuilder.getRandomGatesNumber(gatesConfig);
        const sectorGateNumbers = TrackBuilder.getSectorGateNumbers(numberOfGates);
        console.log('TrackBuilder - Designing a new track of ', numberOfGates, ' gates');

        const gates = TrackBuilder.designGates(trackStyle, gatesConfig, numberOfGates, sectorGateNumbers);
        const decorations = TrackBuilder.designDecorations(gates);

        return new Track(
            undefined,
            Config.CURRENT_BUILDER_VERSION,
            name,
            trackStyle,
            new Date(),
            gates,
            decorations,
            Config.INITIAL_SLOPE
        );
    }

    /**
     * Rebuild an existing track from the storage format
     * @param stockableTrack stockable version of the track
     * @returns the track
     */
    public static buildTrack(stockableTrack: StockableTrack): Track {
        ('TrackBuilder - Rebuilding an existing track');
        return new Track(
            stockableTrack.id,
            stockableTrack.builderVersion,
            stockableTrack.name,
            stockableTrack.style,
            stockableTrack.date,
            stockableTrack.gates.map(gate =>
                Object.assign(
                    new StockableGate(
                        gate.x,
                        gate.y,
                        gate.color,
                        gate.width,
                        gate.gateNumber,
                        gate.isFinal,
                        gate.polesAmount,
                        gate.pivot,
                        gate.vertical,
                        gate.sectorNumber
                    ),
                    gate
                )
            ),
            stockableTrack.decorations,
            stockableTrack.slope
        );
    }

    public static getGatesConfig(trackStyle: TrackStyles): GatesConfig {
        if (trackStyle === TrackStyles.SL) {
            return Config.SL_GATES_CONFIG;
        }
        if (trackStyle === TrackStyles.GS) {
            return Config.GS_GATES_CONFIG;
        }
        if (trackStyle === TrackStyles.SG) {
            return Config.SG_GATES_CONFIG;
        }
        return Config.DH_GATES_CONFIG;
    }

    private static designGates(
        trackStyle: TrackStyles,
        gatesConfig: GatesConfig,
        numberOfGates: number,
        sectorGateNumbers: number[]
    ): StockableGate[] {
        const gates: StockableGate[] = [];

        let previous: StockableGate | undefined;
        let secondPrevious: StockableGate | undefined;

        for (let index = 1; index < numberOfGates; index++) {
            const gate = TrackBuilder.designGate(
                index,
                trackStyle,
                gatesConfig,
                sectorGateNumbers,
                previous,
                secondPrevious,
                numberOfGates === index + 1
            );

            gates.push(gate);

            secondPrevious = previous || undefined;
            previous = gate;
        }

        gates.push(TrackBuilder.generateFinalGate(gates[gates.length - 1], gatesConfig, numberOfGates + 1));
        console.log(gates);
        return gates;
    }

    private static designGate(
        number: number,
        trackStyle: TrackStyles,
        config: GatesConfig,
        sectorGateNumbers: number[],
        previousGate?: StockableGate,
        secondPreviousGate?: StockableGate,
        last?: boolean
    ): StockableGate {
        if (!previousGate) {
            // First gate
            return new StockableGate(
                0,
                -config.minVerticalDistance,
                'red',
                config.maxWidth,
                number,
                false,
                2,
                'none',
                false,
                sectorGateNumbers.indexOf(number) + 1
            );
        }

        // Determine gate pivot
        let pivot: Pivot;
        if (last) {
            pivot = 'none';
        } else if (previousGate.pivot === 'none') {
            if (secondPreviousGate) {
                // Change direction after following gate
                pivot = secondPreviousGate.pivot === 'left' ? 'right' : 'left';
            } else {
                // 50/50 left or right
                pivot = Math.random() > 0.5 ? 'left' : 'right';
            }
        } else {
            // Change direction or make following gate
            const changeDirection = Math.random() < Config.GATE_OTHER_SIDE_PROBABILITY;
            pivot = changeDirection ? (previousGate.pivot === 'left' ? 'right' : 'left') : 'none';
        }

        // Determine gate vertical offset
        let yOffset: number;
        if (pivot === 'none') {
            // Following gate
            yOffset = config.minVerticalDistance * Config.GATE_FOLLOWING_DISTANCE_RATIO;
        } else {
            yOffset =
                config.minVerticalDistance + Math.random() * (config.maxVerticalDistance - config.minVerticalDistance);
        }

        // Determine gate vertical position
        const yPosition = previousGate.y - yOffset;

        // Determine poles amount
        const polesAmount = TrackBuilder.getPolesAmount(trackStyle, pivot);

        // Determine initial gate width
        let width = config.minWidth + Math.random() * (config.maxWidth - config.minWidth);

        // Determine gate horizontal position
        let xPosition: number;
        const offset = Math.random() * config.maxHorizontalDistance;
        if (pivot === 'left') {
            xPosition = Math.min(previousGate.x + offset, Config.GATE_MAX_RIGHT_POSITION - width);
        } else if (pivot === 'right') {
            xPosition = Math.max(previousGate.x - offset, Config.GATE_MAX_LEFT_POSITION + width);
        } else {
            if (previousGate.pivot === 'left') {
                xPosition = Math.max(previousGate.x - offset, Config.GATE_MAX_LEFT_POSITION + width / 2);
            } else {
                xPosition = Math.min(previousGate.x + offset, Config.GATE_MAX_RIGHT_POSITION - width / 2);
            }
        }

        // Adapt gate width for 1 pole gate
        if (polesAmount === 1) {
            width = TrackBuilder.adaptOnePoleWidth(width, config, xPosition, pivot);
        }

        return new StockableGate(
            xPosition,
            yPosition,
            TrackBuilder.getGateColor(number, trackStyle),
            width,
            number,
            false,
            polesAmount,
            pivot,
            false,
            sectorGateNumbers.indexOf(number) + 1
        );
    }

    private static designDecorations(gates: StockableGate[]): StockableDecoration[] {
        const amount = 50 + Math.floor(Math.random() * (Config.DECORATIONS_AMOUNT_MAX_AMOUNT - 50));
        const firstGatePosition = gates[0].y;
        const distanceAvailable = gates[gates.length - 3].y - firstGatePosition;
        const decorations = [];

        for (let i = 0; i <= amount; i++) {
            let xPosition = Config.DISPLAY_WIDTH / 2;
            const yPosition = Math.floor(Math.random() * distanceAvailable) + firstGatePosition;
            const sizeRatio = 20 + Math.random() * 80;
            const left = Math.random() < 0.5;

            const availableOffset = Math.max(
                0,
                Config.DISPLAY_MIN_MARGIN - (sizeRatio / 100) * Config.DECORATION_TREE_SIZE
            );
            const offset = Math.random() * availableOffset;
            xPosition = left ? -xPosition + offset : xPosition - (Config.DISPLAY_MIN_MARGIN + offset);

            const decoration = new StockableDecoration(xPosition, yPosition, 'tree', sizeRatio);
            decorations.push(decoration);
        }

        decorations.sort((d1, d2) => d2.y - d1.y);
        return decorations;
    }

    private static getRandomGatesNumber(gatesConfig: GatesConfig): number {
        return Math.floor(gatesConfig.minNumber + Math.random() * (gatesConfig.maxNumber - gatesConfig.minNumber));
    }

    private static getGateColor(gateNumber: number, trackStyle: TrackStyles): 'red' | 'blue' {
        if (gateNumber % 2 > 0 || trackStyle === TrackStyles.DH) {
            return 'red';
        }
        return 'blue';
    }

    private static generateFinalGate(lastGate: StockableGate, config: GatesConfig, gateNumber: number): StockableGate {
        const yPosition = lastGate.y - config.minVerticalDistance;
        return new StockableGate(
            Config.FINAL_GATE_POSITION,
            yPosition,
            'red',
            Config.FINAL_GATE_WIDTH,
            gateNumber,
            true,
            2,
            'left',
            false,
            Config.SECTORS_PER_RACE + 1
        );
    }

    private static getSectorGateNumbers(gatesNumber: number): number[] {
        const numbers: number[] = [];
        const firstGateNumber = Math.floor(gatesNumber / (Config.SECTORS_PER_RACE + 1));
        for (let i = 1; i <= Config.SECTORS_PER_RACE; i++) {
            numbers.push(firstGateNumber * i);
        }
        return numbers;
    }

    private static getPolesAmount(trackStyle: TrackStyles, pivot: Pivot): 1 | 2 {
        if (trackStyle === 'SL' || trackStyle === 'GS') {
            return pivot === 'none' ? 2 : 1;
        }
        return 2;
    }

    private static adaptOnePoleWidth(
        originalWidth: number,
        config: GatesConfig,
        xPosition: number,
        pivot: Pivot
    ): number {
        if (pivot === 'right') {
            return Math.max(config.minWidth, xPosition - Config.GATE_MAX_LEFT_POSITION);
        }
        if (pivot === 'left') {
            return Math.max(config.minWidth, Config.GATE_MAX_RIGHT_POSITION - xPosition);
        }
        return originalWidth;
    }
}
