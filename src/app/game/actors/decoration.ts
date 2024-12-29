import {
    Actor,
    type Engine,
    type Vector,
    vec,
    GraphicsGroup,
    CircleCollider,
    ColliderComponent,
    CollisionType,
    Sprite,
    Color
} from 'excalibur';
import { ScreenManager } from '../utils/screen-manager';
import { Resources } from '../resources';
import { Config } from '../config';

export class Decoration extends Actor {
    constructor(position: Vector, type: 'tree', sizeRatio: number) {
        const treeSize = (sizeRatio / 100) * Config.DECORATION_TREE_SIZE;
        const shadowSize = (sizeRatio / 100) * Resources.TreeShadow.width;
        super({
            anchor: vec(0, 0),
            pos: position,
            height: treeSize,
            width: treeSize,
            collisionType: CollisionType.Active,
            z: treeSize,
            color: Color.Pink
        });

        this.collider = new ColliderComponent(new CircleCollider({ radius: treeSize }));

        /*
        const graphicsGroup = new GraphicsGroup({
            members: [
                {
                    graphic: new Sprite({
                        image: Resources.TreeShadow,
                        destSize: {
                            width: shadowSize,
                            height: shadowSize
                        }
                    }),
                    useBounds: false,
                    offset: vec(0, - (shadowSize - treeSize))
                },
                {
                    graphic: new Sprite({
                        image: Resources.Tree,
                        destSize: {
                            width: treeSize,
                            height: treeSize
                        }
                    }),
                    offset: vec(0, 0)
                }
            ]
        });

        this.graphics.use(graphicsGroup);
        */

        this.listenExitViewportEvent();
    }

    override update(): void {
        if (ScreenManager.isNearScreen(this, this.scene!.camera) && !this.children?.length) {
            // this.buildSpectators();
        }
    }

    private listenExitViewportEvent(): void {
        this.on('exitviewport', () => this.checkForKill());
    }

    private checkForKill(): void {
        if (ScreenManager.isBehind(this.scene!.camera.pos, this.pos)) {
            this.kill();
        }
    }
}
