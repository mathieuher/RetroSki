import { format } from "date-fns";

export class UiManager {
    private _isDisplayed = false;

    private speedometerUi = document.getElementById('speedometer')!;
    private timerUi = document.getElementById('timer')!;

    public isDisplayed(): boolean {
        return this._isDisplayed;
    }

    public displayUi(): void {
        this.speedometerUi.style.visibility = 'visible';
        this.timerUi.style.visibility = 'visible';
        this._isDisplayed = true;
    }

    public hideUi(): void {
        this.speedometerUi.style.visibility = 'hidden';
        this.timerUi.style.visibility = 'hidden';
        this._isDisplayed = false;
    }

    public updateUi(currentSpeed: number, currentTiming: number): void {
        this.speedometerUi.innerText = `${Math.floor(currentSpeed)} km/h`;
        this.timerUi.innerText = `${format(currentTiming, 'mm:ss:SS')}`;
    }
}