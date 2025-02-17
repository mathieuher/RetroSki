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
    public static designTrack(name: string, trackStyle: TrackStyles, gatesAmount?: number): Track {
        const gatesConfig = TrackBuilder.getGatesConfig(trackStyle);
        const numberOfGates = gatesAmount ?? TrackBuilder.getRandomGatesNumber(gatesConfig);
        const sectorGateNumbers = TrackBuilder.getSectorGateNumbers(numberOfGates);
        const followingGateNumbers = TrackBuilder.getFollowingGateNumbers(gatesConfig, numberOfGates);
        const doubleGateNumbers = TrackBuilder.getDoubleGateNumbers(gatesConfig, numberOfGates, followingGateNumbers);
        const tripleGateNumbers = TrackBuilder.getTripleGateNumbers(
            gatesConfig,
            numberOfGates,
            followingGateNumbers,
            doubleGateNumbers
        );
        console.log('TrackBuilder - Designing a new track of ', numberOfGates, ' gates');

        const gates = TrackBuilder.designGates(
            trackStyle,
            gatesConfig,
            numberOfGates,
            sectorGateNumbers,
            followingGateNumbers,
            doubleGateNumbers,
            tripleGateNumbers
        );
        const decorations = TrackBuilder.designDecorations(gates);

        return new Track(
            undefined,
            Config.CURRENT_BUILDER_VERSION,
            name,
            trackStyle,
            new Date(),
            gates,
            decorations,
            Config.DEFAULT_TRACK_SLOPE
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
            stockableTrack.slope || Config.DEFAULT_TRACK_SLOPE
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
        sectorGateNumbers: number[],
        followingGateNumbers: number[],
        doubleGateNumbers: number[],
        tripleGateNumbers: number[]
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
                followingGateNumbers,
                doubleGateNumbers,
                tripleGateNumbers,
                previous,
                secondPrevious,
                numberOfGates === index + 1
            );
            gates.push(gate);
            secondPrevious = previous || undefined;
            previous = gate;
        }
        gates.push(TrackBuilder.generateFinalGate(gates[gates.length - 1], gatesConfig, numberOfGates + 1));
        return gates;
    }

    private static designGate(
        number: number,
        trackStyle: TrackStyles,
        config: GatesConfig,
        sectorGateNumbers: number[],
        followingGateNumbers: number[],
        doubleGateNumbers: number[],
        tripleGateNumbers: number[],
        previousGate?: StockableGate,
        secondPreviousGate?: StockableGate,
        isLast?: boolean
    ): StockableGate {
        if (!previousGate) {
            // First gate
            return TrackBuilder.designFirstGate(config);
        }

        // Determine gate pivot
        const pivot = TrackBuilder.determineGatePivot(
            number,
            followingGateNumbers,
            previousGate,
            secondPreviousGate,
            isLast
        );

        // Build vertical gate
        let vertical = false;
        let yOffset: number;
        let yPosition: number;
        let polesAmount: number;
        let width: number;
        let xPosition: number;

        vertical = doubleGateNumbers.indexOf(number) !== -1 || tripleGateNumbers.indexOf(number) !== -1;

        if (vertical) {
            const isFirst = !previousGate.vertical;
            yOffset = isFirst
                ? TrackBuilder.determineGateVerticalOffset(pivot, config)
                : Config.GATE_VERTICAL_HEIGHT + Config.GATE_VERTICAL_BETWEEN_MARGIN;
            yPosition = previousGate.y - yOffset;
            polesAmount = 2;
            width = Config.GATE_VERTICAL_HEIGHT;
            xPosition = previousGate.x;
        } else {
            // Determine gate vertical offset
            yOffset = TrackBuilder.determineGateVerticalOffset(pivot, config);
            // Adapt offset after vertical gate
            yOffset += previousGate.vertical ? Config.GATE_VERTICAL_HEIGHT : 0;

            // Determine gate vertical position
            yPosition = previousGate.y - yOffset;

            // Determine poles amount
            polesAmount = TrackBuilder.getPolesAmount(trackStyle, pivot);

            // Determine initial gate width
            width = config.minWidth + Math.random() * (config.maxWidth - config.minWidth);

            // Determine gate horizontal position
            xPosition = TrackBuilder.determineHorizontalGatePosition(pivot, width, previousGate, config);

            // Adapt gate width for 1 pole gate
            if (polesAmount === 1) {
                width = TrackBuilder.adaptOnePoleWidth(width, config, xPosition, pivot);
            }
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
            vertical,
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

    private static determineGatePivot(
        number: number,
        followingGateNumbers: number[],
        previousGate: StockableGate,
        secondPreviousGate?: StockableGate,
        isLast?: boolean
    ): Pivot {
        if (isLast) {
            return 'none';
        }
        if (previousGate.pivot === 'none') {
            if (secondPreviousGate) {
                // Change direction after following gate
                return secondPreviousGate.pivot === 'left' ? 'right' : 'left';
            }
            // 50/50 left or right
            return Math.random() > 0.5 ? 'left' : 'right';
        }
        // Change direction or make following gate
        const changeDirection = followingGateNumbers.indexOf(number) === -1;
        // const changeDirection = Math.random() < Config.GATE_OTHER_SIDE_PROBABILITY;
        return changeDirection ? (previousGate.pivot === 'left' ? 'right' : 'left') : 'none';
    }

    private static determineGateVerticalOffset(pivot: Pivot, config: GatesConfig): number {
        if (pivot === 'none') {
            // Following gate
            return config.minVerticalDistance * Config.GATE_FOLLOWING_DISTANCE_RATIO;
        }
        return config.minVerticalDistance + Math.random() * (config.maxVerticalDistance - config.minVerticalDistance);
    }

    private static determineHorizontalGatePosition(
        pivot: Pivot,
        width: number,
        previousGate: StockableGate,
        config: GatesConfig
    ): number {
        const offset = Math.random() * config.maxHorizontalDistance;
        if (pivot === 'left') {
            return Math.min(previousGate.x + offset, Config.GATE_MAX_RIGHT_POSITION - width);
        }
        if (pivot === 'right') {
            return Math.max(previousGate.x - offset, Config.GATE_MAX_LEFT_POSITION + width);
        }
        if (previousGate.pivot === 'left') {
            return Math.max(previousGate.x - offset, Config.GATE_MAX_LEFT_POSITION + width / 2);
        }
        return Math.min(previousGate.x + offset, Config.GATE_MAX_RIGHT_POSITION - width / 2);
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

    private static designFirstGate(config: GatesConfig): StockableGate {
        return new StockableGate(0, -config.minVerticalDistance, 'red', config.maxWidth, 1, false, 2, 'none', false, 0);
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

    private static getFollowingGateNumbers(config: GatesConfig, gatesNumber: number): number[] {
        const numbers: number[] = [];
        const availableGates = new Array(gatesNumber)
            .fill(null)
            .map((_, index) => index + 1)
            // Remove first 2 gate
            .filter(number => number > 2)
            // Remove last 2 gate
            .filter(number => number < gatesNumber - 2)
            // Limit to odd gate to avoid 2 consecutive following gate
            .filter(number => number % 2 === 1);
        for (let index = 0; index < config.followingGateAmount; index++) {
            numbers.push(availableGates[Math.floor(Math.random() * availableGates.length)]);
        }
        return numbers.sort((a, b) => a - b);
    }

    private static getDoubleGateNumbers(
        config: GatesConfig,
        gatesNumber: number,
        followingGateNumbers: number[]
    ): number[] {
        const numbers: number[] = [];
        const availableGates = new Array(gatesNumber)
            .fill(null)
            .map((_, index) => index + 1)
            // Remove first 2 gate
            .filter(number => number > 2)
            // Remove last 2 gate
            .filter(number => number < gatesNumber - 2)
            // Remove following gate
            .filter(
                number => followingGateNumbers.indexOf(number) === -1 && followingGateNumbers.indexOf(number + 1) === -1
            );

        for (let index = 0; index < config.doubleGateAmount; index++) {
            const possibleGates = availableGates
                // Avoid following another double
                .filter(g => numbers.indexOf(g - 1) === -1)
                // Avoid to be before another double
                .filter(g => numbers.indexOf(g + 2) === -1)
                // Be sur to have two consecutive gate available
                .filter(a => availableGates.indexOf(a + 1) !== -1);

            const startNumber = possibleGates[Math.floor(Math.random() * possibleGates.length)];
            availableGates.splice(availableGates.indexOf(startNumber), 2);
            numbers.push(startNumber, startNumber + 1);
        }
        return numbers.sort((a, b) => a - b);
    }

    private static getTripleGateNumbers(
        config: GatesConfig,
        gatesNumber: number,
        followingGateNumbers: number[],
        doubleGateNumbers: number[]
    ): number[] {
        const numbers: number[] = [];
        const availableGates = new Array(gatesNumber)
            .fill(null)
            .map((_, index) => index + 1)
            // Remove first 2 gate
            .filter(number => number > 2)
            // Remove last 2 gate
            .filter(number => number < gatesNumber - 2)
            // Remove following gate
            .filter(
                number => followingGateNumbers.indexOf(number) === -1 && followingGateNumbers.indexOf(number + 1) === -1
            )
            // Remove double gate and gate around them
            .filter(
                number =>
                    doubleGateNumbers.indexOf(number - 1) +
                        doubleGateNumbers.indexOf(number) +
                        doubleGateNumbers.indexOf(number + 1) ===
                    -3
            );

        for (let index = 0; index < config.tripleGateAmount; index++) {
            const possibleGates = availableGates
                // Avoid following another triple
                .filter(g => numbers.indexOf(g - 1) === -1)
                // Avoid to be before another triple
                .filter(g => numbers.indexOf(g + 3) === -1)
                // Be sur to have two consecutive gate available
                .filter(a => availableGates.indexOf(a + 1) !== -1 && availableGates.indexOf(a + 2) !== -1);

            const startNumber = possibleGates[Math.floor(Math.random() * possibleGates.length)];
            availableGates.splice(availableGates.indexOf(startNumber), 3);
            numbers.push(startNumber, startNumber + 1, startNumber + 2);
        }
        return numbers.sort((a, b) => a - b);
    }

    private static getPolesAmount(trackStyle: TrackStyles, pivot: Pivot): 1 | 2 {
        if (trackStyle === 'SL') {
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
