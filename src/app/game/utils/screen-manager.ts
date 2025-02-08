import type { Actor, Camera, Vector } from 'excalibur';
import { Config } from '../config';

export class ScreenManager {
    public static isNearScreen(item: Actor, camera: Camera): boolean {
        return Math.abs(camera.y - item.pos.y) < item.scene!.engine.canvasHeight;
    }

    public static isBehind(cameraPositionY: number, itemPositionY: number): boolean {
        return cameraPositionY < itemPositionY + Config.FRONT_GHOST_DISTANCE;
    }
}
