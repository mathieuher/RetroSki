import { GameSetup } from '../models/game-setup';

export class GameSetupManager {
	private gameSetupButton: HTMLElement = document.getElementById('game-setup-button')!;

	private gameSetupUi = document.getElementById('game-setup')!;
	private soundsCheckbox = document.getElementById('sounds-checkbox')! as HTMLInputElement;
	private spectatorsCheckbox = document.getElementById('spectators-checkbox')! as HTMLInputElement;
	private ghostsCheckbox = document.getElementById('ghosts-checkbox')! as HTMLInputElement;
	private resetButton: HTMLElement = document.getElementById('reset-game-setup-button')!;
	private saveButton: HTMLElement = document.getElementById('save-game-setup-button')!;

	private gameSetup = new GameSetup();

	constructor() {
		this.gameSetupButton.addEventListener('click', () => {
			this.showGameSetup();
		});

		this.resetButton.addEventListener('click', () => {
			this.resetGameSetup();
		});

		this.saveButton.addEventListener('click', () => {
			this.saveGameSetup();
		});
	}

	public showGameSetupButton(): void {
		this.gameSetupButton.style.display = 'flex';
	}

	public hideGameSetupButton(): void {
		this.gameSetupButton.style.display = 'none';
	}

	public getGameSetup(): GameSetup {
		return this.gameSetup;
	}

	public toggleGhosts(): void {
		this.gameSetup.ghosts = !this.gameSetup.ghosts;
		this.ghostsCheckbox.checked = this.gameSetup.ghosts;
	}

	private showGameSetup(): void {
		this.gameSetupUi.style.display = 'flex';
	}

	private hideGameSetup(): void {
		this.gameSetupUi.style.display = 'none';
	}

	private resetGameSetup(): void {
		localStorage.clear();
		location.reload();
	}

	private saveGameSetup(): void {
		this.gameSetup.sounds = this.soundsCheckbox.checked;
		this.gameSetup.spectators = this.spectatorsCheckbox.checked;
		this.gameSetup.ghosts = this.ghostsCheckbox.checked;
		this.hideGameSetup();
	}
}
