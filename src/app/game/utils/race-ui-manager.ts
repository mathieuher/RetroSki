import { format } from 'date-fns';
import type { Engine } from 'excalibur';
import { Config } from '../config';

export class RaceUiManager {
    private previousSpeed: number | undefined;

    private globalGhostTimingContainerUi = document.getElementById('global-ghost-timing-container')!;
    private globalGhostTimingUi = document.getElementById('global-ghost-timing')!;
    private eventGhostTimingContainerUi = document.getElementById('event-ghost-timing-container')!;
    private eventGhostTimingUi = document.getElementById('event-ghost-timing')!;
    private speedometerUi = document.getElementById('speedometer')!;
    private timerUi = document.getElementById('timer')!;

    public displayRacingUi(): void {
        this.speedometerUi.classList.add('visible');
        this.timerUi.classList.add('visible');
    }

    public updateRacingUi(currentSpeed: number, currentTiming: number): void {
        const flooredCurrentSpeed = Math.floor(currentSpeed);
        if (flooredCurrentSpeed !== this.previousSpeed) {
            this.previousSpeed = flooredCurrentSpeed;
            this.speedometerUi.innerText = `${flooredCurrentSpeed} km/h`;
        }
        this.timerUi.innerText = `${format(currentTiming, 'mm:ss:SS')}`;
    }

    public flashTimer(engine: Engine): void {
        this.timerUi.classList.add('penalty');
        engine.clock.schedule(() => {
            this.timerUi.classList.remove('penalty');
        }, 750);
    }

    public hideUi(): void {
        this.hideGhostsUi();
        this.hideRacingUi();
    }

    public displayGhostsTiming(globalGhostTiming?: number, eventGhostTiming?: number): void {
        if (globalGhostTiming) {
            this.globalGhostTimingUi.innerText = format(globalGhostTiming, Config.FORMAT_TIMING);
            this.globalGhostTimingContainerUi.classList.add('visible');
        }

        if (eventGhostTiming) {
            this.eventGhostTimingUi.innerText = format(eventGhostTiming, Config.FORMAT_TIMING);
            this.eventGhostTimingContainerUi.classList.add('visible');
        }
    }

    public displayGhostSectorTiming(
        engine: Engine,
        skierTime: number,
        globalGhostTime?: number,
        eventGhostTime?: number
    ): void {
        if (globalGhostTime) {
            this.displaySector(skierTime, globalGhostTime, this.globalGhostTimingUi, this.globalGhostTimingContainerUi);
        }
        if (eventGhostTime) {
            this.displaySector(skierTime, eventGhostTime, this.eventGhostTimingUi, this.eventGhostTimingContainerUi);
        }

        engine.clock.schedule(() => this.hideGhostsUi(), Config.SECTOR_DISPLAY_TIME);
    }

    private displaySector(
        skierTime: number,
        referenceTime: number,
        textUi: HTMLElement,
        containerUi: HTMLElement
    ): void {
        const isSkierFaster = skierTime < referenceTime;
        const timeDifference = Math.abs(referenceTime - skierTime);
        textUi.innerText = `${isSkierFaster ? '-' : '+'} ${format(
            timeDifference,
            timeDifference >= 60000 ? 'mm:ss:SS' : 'ss:SS'
        )}`;
        containerUi.classList.add(isSkierFaster ? 'fast-sector' : 'slow-sector');
        containerUi.classList.add('visible');
    }

    public hideGhostsUi(): void {
        this.globalGhostTimingContainerUi.classList.remove('visible');
        this.eventGhostTimingContainerUi.classList.remove('visible');
        this.globalGhostTimingContainerUi.classList.remove('slow-sector');
        this.globalGhostTimingContainerUi.classList.remove('fast-sector');
        this.eventGhostTimingContainerUi.classList.remove('slow-sector');
        this.eventGhostTimingContainerUi.classList.remove('fast-sector');
    }

    private hideRacingUi(): void {
        this.speedometerUi.classList.remove('visible');
        this.timerUi.classList.remove('visible');
    }
}
