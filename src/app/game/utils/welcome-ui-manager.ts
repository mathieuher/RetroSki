export class WelcomeUiManager {
	private welcomeUi = document.getElementById('welcome')!;
	private exitWelcomeButtonUi = document.getElementById('exit-welcome-button')!;

	constructor() {
		// this.listenExitWelcomeButton();
	}

	public showWelcomeUi(): void {
		this.welcomeUi.style.display = 'flex';
	}

	private listenExitWelcomeButton(): void {
		this.exitWelcomeButtonUi.addEventListener('click', () => {
			this.exitWelcomeUi();
		});
	}

	private hideWelcomeUi(): void {
		this.welcomeUi.style.display = 'none';
	}

	private exitWelcomeUi(): void {
		this.hideWelcomeUi();
	}
}
