import { format } from "date-fns";

export class UiManager {
    public state: 'menu' | 'racing' | 'result' = 'menu';

    private _isDisplayed = false;

    private resultUi = document.getElementById('result')!;
    private resultPositionUi = document.getElementById('position')!;
    private resultTimingUi = document.getElementById('timing')!;
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
        this.speedometerUi.style.visibility = 'hidden';
        this.timerUi.style.visibility = 'hidden';
        this._isDisplayed = false;
    }

    public updateUi(currentSpeed: number, currentTiming: number, position?: number): void {
        const formatedTiming = `${format(currentTiming, 'mm:ss:SS')}`;

        if (this.state === 'result') {
            this.resultPositionUi.innerText = `${position}`;
            this.resultTimingUi.innerText = formatedTiming;
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
        this.speedometerUi.style.visibility = 'visible';
        this.timerUi.style.visibility = 'visible';
    }

    private showResultUi(): void {
        this.resultUi.style.display = 'flex';
    }
}