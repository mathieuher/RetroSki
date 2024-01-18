import { format } from "date-fns";
import { RecordResult } from "../models/record-result";
import { Track } from "../models/track";

export class UiManager {
    public state: 'menu' | 'racing' | 'result' = 'menu';

    private _isDisplayed = false;

    private resultUi = document.getElementById('result')!;
    private resultsContainerUi = document.getElementById('results-container')!;
    private trackNameUi = document.getElementById('track-name')!;
    private speedometerUi = document.getElementById('speedometer')!;
    private timerUi = document.getElementById('timer')!;
    public backToManagerButton = document.getElementById('back-to-manager')!;

    constructor() {
        this.updateUiState(this.state);
    }

    public isDisplayed(): boolean {
        return this._isDisplayed;
    }

    public hideUi(): void {
        this.resultUi.style.display = 'none';
        this.resultsContainerUi.innerHTML = '';
        this.trackNameUi.style.display = 'none';
        this.trackNameUi.innerText = '';
        this.speedometerUi.style.display = 'none';
        this.timerUi.style.display = 'none';
        this._isDisplayed = false;
    }

    public updateUi(currentSpeed: number, currentTiming: number, track?: Track, globalResult?: { position: number, records: RecordResult[] },): void {
        const formatedTiming = `${format(currentTiming, 'mm:ss:SS')}`;

        if (this.state === 'result') {
            location.hash = '';
            this.resultsContainerUi.innerHTML = this.prepareResultsTable(globalResult!);
            location.hash = 'startPosition';
        }
        if (!this.trackNameUi.innerText && track) {
            this.trackNameUi.innerText = `${track.style} - ${track.name}`;
        }

        this.speedometerUi.innerText = `${Math.floor(currentSpeed)} km/h`;
        this.timerUi.innerText = formatedTiming;
    }

    public updateUiState(state: 'menu' | 'racing' | 'result'): void {
        this.state = state;
        switch (state) {
            case 'menu':
                this.hideUi();
                break;

            case 'racing':
                this.showRacingUi();
                break;

            case 'result':
                this.showResultUi();
                break;

            default:

        }
    }

    private showRacingUi(): void {
        this.resultUi.style.display = 'none';
        this.trackNameUi.style.display = 'flex';
        this.speedometerUi.style.display = 'flex';
        this.timerUi.style.display = 'flex';
    }

    private showResultUi(): void {
        this.resultUi.style.display = 'flex';
    }

    private prepareResultsTable(globalResult: { position: number, records: RecordResult[] }): string {
        return globalResult.records.map(result => {
            const currentResult = result.position === globalResult.position;
            const startPosition = result.position === (globalResult.position - 4 || 1);
            return `<div ${startPosition ? 'id="startPosition"' : ''} class="result-line ${currentResult ? 'current' : ''}">
                <div>${result.position}</div>
                <div>${result.player}</div>
                <div>${result.date}</div>
                <div class="time">${result.time}</div>
                <div class="time">${result.difference ? '+ ' + result.difference : ''}</div>
            </div>`
        }).join('');
    }
}