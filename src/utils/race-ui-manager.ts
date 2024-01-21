import { format } from "date-fns";
import { RecordResult } from "../models/record-result";
import { delay } from "excalibur/build/dist/Util/Util";
import { Engine } from "excalibur";
import { Config } from "../config";

export class RaceUiManager {

    private resultUi = document.getElementById('result')!;
    private resultsContainerUi = document.getElementById('results-container')!;
    private trackNameUi = document.getElementById('track-name')!;
    private globalGhostTimingContainerUi = document.getElementById('global-ghost-timing-container')!;
    private globalGhostTimingUi = document.getElementById('global-ghost-timing')!;
    private eventGhostTimingContainerUi = document.getElementById('event-ghost-timing-container')!;
    private eventGhostTimingUi = document.getElementById('event-ghost-timing')!;
    private speedometerUi = document.getElementById('speedometer')!;
    private timerUi = document.getElementById('timer')!;
    public backToManagerButton = document.getElementById('back-to-manager')!;

    constructor() { }

    public buildUi(fullTrackName: string): void {
        this.displayTrackName(fullTrackName);
    }

    public displayRacingUi(): void {
        this.speedometerUi.style.display = 'flex';
        this.timerUi.style.display = 'flex';
    }

    public updateRacingUi(currentSpeed: number, currentTiming: number): void {
        this.speedometerUi.innerText = `${Math.floor(currentSpeed)} km/h`;
        this.timerUi.innerText = `${format(currentTiming, 'mm:ss:SS')}`;;
    }

    public displayResultUi(globalResult: { position: number, records: RecordResult[] }, missedGates: number): void {
        this.resultUi.style.display = 'flex';
        this.updateResultUi(globalResult, missedGates);
    }

    public flashTimer(engine: Engine): void {
        this.timerUi.style.color = '#f5090987';
        delay(750, engine.clock).then(() => {
            this.timerUi.style.color = '#4c829087';
        })
    }

    public hideUi(): void {
        this.hideGhostsUi();
        this.hideTrackName();
        this.hideRacingUi();
        this.hideResultUi();
    }

    public displayGhostsTiming(globalGhostTiming?: number, eventGhostTiming?: number): void {
        if (globalGhostTiming) {
            this.globalGhostTimingUi.innerText = format(globalGhostTiming, Config.FORMAT_TIMING);
            this.globalGhostTimingContainerUi.style.right = '0';
        }

        if (eventGhostTiming) {
            this.eventGhostTimingUi.innerText = format(eventGhostTiming, Config.FORMAT_TIMING);
            this.eventGhostTimingContainerUi.style.right = '0';
        }
    }

    public hideGhostsUi(): void {
        this.globalGhostTimingContainerUi.style.right = 'calc(-140px - 2rem)';
        this.eventGhostTimingContainerUi.style.right = 'calc(-140px - 2rem)';
    }

    private hideRacingUi(): void {
        this.speedometerUi.style.display = 'none';
        this.timerUi.style.display = 'none';
    }

    private hideResultUi(): void {
        this.resultUi.style.display = 'none';
    }

    private updateResultUi(globalResult: { position: number, records: RecordResult[] }, missedGates: number): void {
        location.hash = '';
        this.resultsContainerUi.innerHTML = this.prepareResultsTable(globalResult!, missedGates);
        location.hash = 'startPosition';
    }

    private displayTrackName(fullTrackName: string): void {
        this.trackNameUi.innerText = fullTrackName;
        this.trackNameUi.style.display = 'flex';
    }

    private hideTrackName(): void {
        this.trackNameUi.style.display = 'none';
    }

    private prepareResultsTable(globalResult: { position: number, records: RecordResult[] }, missedGates: number): string {
        return globalResult.records.map(result => {
            const currentResult = result.position === globalResult.position;
            const startPosition = result.position === (globalResult.position > 4 ? (globalResult.position - 4) : 1);
            const timeHtml = currentResult && missedGates ? `${result.time}<br><i class="fa-solid fa-triangle-exclamation"></i> missed ${missedGates} gate${missedGates > 1 ? 's' : ''}` : `${result.time}`;
            return `<div ${startPosition ? 'id="startPosition"' : ''} class="result-line ${currentResult ? 'current' : ''}">
                <div>${result.position}</div>
                <div>${result.player}</div>
                <div>${result.date}</div>
                <div class="time">${timeHtml}</div>
                <div class="time">${result.difference ? '+ ' + result.difference : ''}</div>
            </div>`
        }).join('');
    }
}