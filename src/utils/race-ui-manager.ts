import { format } from "date-fns";
import { RecordResult } from "../models/record-result";

export class RaceUiManager {

    private resultUi = document.getElementById('result')!;
    private resultsContainerUi = document.getElementById('results-container')!;
    private trackNameUi = document.getElementById('track-name')!;
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

    public hideUi(): void {
        this.hideTrackName();
        this.hideRacingUi();
        this.hideResultUi();
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