import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Signal } from '@angular/core';
import { Game } from '../../game/game';
import { SettingsService } from '../../common/services/settings.service';
import { Router } from '@angular/router';
import { ButtonIconComponent } from "../../common/components/button-icon/button-icon.component";
import { RaceConfig } from '../../game/models/race-config';
import { TrackManager } from '../../game/utils/track-manager';
import { GhostManager } from '../../game/utils/ghost-manager';
import { RaceResult } from '../../game/models/race-result';
import { StockableRecord } from '../../game/models/stockable-record';
import { GlobalResult } from '../../game/models/global-result';
import { RankingLineComponent } from "../../common/components/ranking-line/ranking-line.component";
import { format } from "date-fns";
import { Config } from '../../game/config';

class RaceRanking {
    public globalResult: GlobalResult;
    public timing: number;
    public penalties: number;

    constructor(globalResult: GlobalResult, timing: number, penalties: number) {
        this.globalResult = globalResult;
        this.timing = timing;
        this.penalties = penalties;
    }

    public getPositionLabel(): string {
        if(this.globalResult.position > 3) {
            return `${this.globalResult.position}th`;
        }
        if(this.globalResult.position === 3) {
            return `${this.globalResult.position}rd`;
        }
        if(this.globalResult.position === 2) {
            return `${this.globalResult.position}nd`;
        }
        return `${this.globalResult.position}st`;
    }

    public getTime(): string {
        return format(this.timing, 'mm:ss:SS');
    }

    public getPenaltiesLabel(): string {
        if(this.penalties) {
            if(this.penalties > 1) {
                return `${this.penalties} penalties (+${this.penalties * (Config.MISSED_GATE_PENALTY_TIME / 1000)}s)`;
            }
            return `${this.penalties} penalty (+${Config.MISSED_GATE_PENALTY_TIME / 1000}s)`;
        }
        return '';
    }
}

@Component({
  selector: 'app-race',
  standalone: true,
  imports: [ButtonIconComponent, RankingLineComponent],
  templateUrl: './race.component.html',
  styleUrl: './race.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceComponent implements OnInit {
    private router = inject(Router);
    private settingsService = inject(SettingsService);

    protected raceConfig: RaceConfig;
    protected raceRanking = signal<RaceRanking | undefined>(undefined);

    private trackManager = new TrackManager();
    private game?: Game;

    constructor() {
        this.raceConfig = this.buildRaceConfig();
    }

    ngOnInit(): void {
        this.game = new Game(this.raceConfig, this.settingsService);
        this.game.initialize();
        this.listenToRaceStop();
    }

    protected exitRace(): void {
        this.game?.stop();
        this.router.navigate(['/local-event']);
    }

    private buildRaceConfig(): RaceConfig {
        const track = this.trackManager.getTrackFromLocalStorage('zermatt')!.toTrack();
        const globalGhost = GhostManager.getGlobalGhost(track.name);
        const eventGhost = GhostManager.getEventGhost();
        return new RaceConfig('1', 'Mat', track!, globalGhost, eventGhost);
    }

    private listenToRaceStop(): void {
        this.game!.raceStopped.subscribe((result?: RaceResult) => {
            if(result) {
                const globalResult = this.saveRecord(result);
                this.saveGhosts(result, globalResult);

                // TODO : Display race timing
                this.raceRanking.set(new RaceRanking(globalResult, result.timing, result.missedGates));

            } else {
                this.exitRace();
            }

        })
    }

    private saveRecord(result: RaceResult): GlobalResult {
        const stockableRecord = new StockableRecord(result.rider, result.date, result.timing);
        return this.trackManager.saveRecord(this.raceConfig.track, stockableRecord)!;
        
    }

    private saveGhosts(result: RaceResult, globalResult: GlobalResult): void {
        if (globalResult?.position === 1) {
			GhostManager.setGlobalGhost(result.ghost);
		}

		if (!this.raceConfig.eventGhost || result.timing < this.raceConfig.eventGhost?.totalTime!) {
			GhostManager.setEventGhost(result.ghost);
		}
    }
    
}
