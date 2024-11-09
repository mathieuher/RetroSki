import { StockableGhost } from "../models/stockable-ghost";
import { StorageManager } from "./storage-manager";

export class GhostManager {

    public static getGlobalGhost(trackname: string): StockableGhost | undefined {
        const globalRecordGhostJson = localStorage.getItem(`ghost_${trackname}`);
        if(globalRecordGhostJson) {
            return Object.assign(new StockableGhost(), JSON.parse(globalRecordGhostJson));
        }
        return undefined;
    }

    public static getEventGhost(): StockableGhost | undefined {
        const eventRecordGhostJson = localStorage.getItem('event_ghost');
        if(eventRecordGhostJson) {
            return Object.assign(new StockableGhost(), JSON.parse(eventRecordGhostJson));
        }
        return undefined;
    }

    /*
    public static setGlobalGhost(ghost: StockableGhost): void {
        StorageManager.save(`ghost_${ghost.trackName}`, JSON.stringify(ghost));
    }
    */

    public static setEventGhost(ghost: StockableGhost): void {
        StorageManager.save(`event_ghost`, JSON.stringify(ghost));
    }


}