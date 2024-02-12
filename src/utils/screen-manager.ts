import { Actor, Camera } from "excalibur";

export class ScreenManager {

    public static isNearScreen(item: Actor, camera: Camera): boolean {
        return (
            Math.abs(camera.y - item.pos.y) <
            item.scene.engine.halfCanvasHeight
        );
    }
}