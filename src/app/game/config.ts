import { Axes, Buttons, Keys } from 'excalibur';
import { Resources } from './resources';
import { TrackStyles } from './models/track-styles.enum';

export class Config {
    // DISPLAY
    static DISPLAY_WIDTH = 800;
    static DISPLAY_HEIGHT = 800;
    static CAMERA_ZOOM = 1;
    static DISPLAY_MIN_MARGIN = 75;
    static DISPLAY_MAX_RIGHT_POSITION = Config.DISPLAY_WIDTH / 2 - Config.DISPLAY_MIN_MARGIN;
    static DISPLAY_MAX_LEFT_POSITION = -Config.DISPLAY_MAX_RIGHT_POSITION;
    static FRONT_GHOST_DISTANCE = -Config.DISPLAY_HEIGHT / 3.8;

    // SOUND
    static RACE_AMBIANCE_SOUND_VOLUME = 0.08;
    static BRAKING_SOUND_VOLUME = 0.3;
    static CARVING_SOUND_VOLUME = 0.15;
    static FINISH_SOUND_VOLUME = 0.2;
    static GATE_MISSED_SOUND_VOLUME = 0.25;
    static POLE_HIT_SOUND_VOLUME = 0.08;

    // RACE
    static MISSED_GATE_PENALTY_TIME = 3000;
    static SECTORS_PER_RACE = 2;
    static SECTOR_DISPLAY_TIME = 4500;

    // FORMAT
    static FORMAT_TIMING = 'mm:ss:SS';

    // TRACKS
    static CURRENT_BUILDER_VERSION = 4;
    static DEFAULT_TRACKS = ['soelden', 'davos', 'wengen', 'adelboden', 'zermatt'];

    // CONTROLS
    static KEYBOARD_CONTROL_CARVE_RIGHT = Keys.ArrowRight;
    static KEYBOARD_CONTROL_CARVE_LEFT = Keys.ArrowLeft;
    static KEYBOARD_CONTROL_BRAKE = Keys.Space;
    static KEYBOARD_DEBUG_KEY = Keys.D;
    static KEYBOARD_RESTART_KEY = Keys.R;
    static KEYBOARD_EXIT_KEY = Keys.Escape;
    static KEYBOARD_START_KEY = Keys.ArrowUp;
    static KEYBOARD_GHOST_KEY = Keys.G;

    static GAMEPAD_AXES_FILTER_RATE = 0.1;
    static GAMEPAD_CONTROL_CARVE = Axes.LeftStickX;
    static GAMEPAD_CONTROL_BRAKE = Buttons.Face2;
    static GAMEPAD_EXIT_BUTTON = Buttons.Select;
    static GAMEPAD_RACE_BUTTON = Buttons.Face1;
    static GAMEPAD_START_BUTTON = Buttons.Start;
    static GAMEPAD_GHOST_BUTTON = Buttons.LeftBumper;

    static TOUCH_BRAKE_ZONE_RATIO = 0.2;

    // DYNAMIC
    static MAX_SPEED = 150;
    static VELOCITY_MULTIPLIER_RATE = 7 * 0.6;
    static LATERAL_VELOCITY_ROTATION_RATE = 1.08;
    // ROTATION
    static MAX_RIGHT_ROTATION_ANGLE = Math.PI / 2;
    static MAX_LEFT_ROTATION_ANGLE = (3 * Math.PI) / 2;
    static ROTATION_RECENTER_RATE = 0.2;

    // SLOPE
    static INITIAL_SLOPE = 0.115;

    // SKIER
    static ACCELERATION_RATE = 3;
    static BRAKING_RATE = 1;
    static CARVING_ADHERENCE_RATE = 0.9;
    static CARVING_BRAKING_RATE = 0.01;
    static SLIDING_ADHERENCE_RATE = 0.65;
    static SLIDING_BRAKING_RATE = 0.8;
    // SKIER SPECIFIC STYLE DYNAMIC
    static SL_SKIER_CONFIG = {
        windFrictionRate: 0.0025,
        carvingRotationRate: 3.2,
        carvingOptimalSpeed: 50,
        slidingRotationRate: 3.7,
        slidingOptimalSpeed: 35
    };
    static GS_SKIER_CONFIG = {
        windFrictionRate: 0.0022,
        carvingRotationRate: 3.1,
        carvingOptimalSpeed: 60,
        slidingRotationRate: 3.6,
        slidingOptimalSpeed: 45
    };
    static SG_SKIER_CONFIG = {
        windFrictionRate: 0.002,
        carvingRotationRate: 2.5,
        carvingOptimalSpeed: 70,
        slidingRotationRate: 3.0,
        slidingOptimalSpeed: 50
    };
    static DH_SKIER_CONFIG = {
        windFrictionRate: 0.0018,
        carvingRotationRate: 2.2,
        carvingOptimalSpeed: 75,
        slidingRotationRate: 2.7,
        slidingOptimalSpeed: 60
    };

    // GATES
    static GATE_MAX_LEFT_POSITION = Config.DISPLAY_MAX_LEFT_POSITION;
    static GATE_MAX_RIGHT_POSITION = Config.DISPLAY_MAX_RIGHT_POSITION;
    static FINAL_GATE_WIDTH = Config.DISPLAY_WIDTH - 2 * Config.DISPLAY_MIN_MARGIN;
    static FINAL_GATE_POSITION = Config.DISPLAY_MAX_LEFT_POSITION;
    static GATE_OTHER_SIDE_PROBABILITY = 0.95;
    // SPECIFIC TRACK STYLE CONFIG
    static SL_GATES_CONFIG = {
        trackStyle: TrackStyles.SL,
        maxWidth: 114,
        minWidth: 90,
        maxHorizontalDistance: 192,
        minVerticalDistance: 102,
        maxVerticalDistance: 162,
        minNumber: 41,
        maxNumber: 51,
        poleWidth: 3,
        poleHeight: 20,
        poleSprites: new Map([
            ['red', Resources.PoleSlRed.toSprite()],
            ['blue', Resources.PoleSlBlue.toSprite()]
        ]),
        poleCheckSprites: new Map([
            ['red', Resources.PoleCheckRed.toSprite()],
            ['blue', Resources.PoleCheckBlue.toSprite()]
        ]),
        poleShadow: Resources.PoleSlShadow.toSprite()
    };
    static GS_GATES_CONFIG = {
        trackStyle: TrackStyles.GS,
        maxWidth: 120,
        minWidth: 96,
        maxHorizontalDistance: 192,
        minVerticalDistance: 120,
        maxVerticalDistance: 210,
        minNumber: 44,
        maxNumber: 54,
        poleWidth: 12,
        poleHeight: 12,
        poleSprites: new Map([
            ['red', Resources.PoleRed.toSprite()],
            ['blue', Resources.PoleBlue.toSprite()]
        ]),
        poleCheckSprites: new Map([
            ['red', Resources.PoleCheckRed.toSprite()],
            ['blue', Resources.PoleCheckBlue.toSprite()]
        ]),
        poleShadow: Resources.PoleShadow.toSprite()
    };
    static SG_GATES_CONFIG = {
        trackStyle: TrackStyles.SG,
        maxWidth: 144,
        minWidth: 114,
        maxHorizontalDistance: 210,
        minVerticalDistance: 192,
        maxVerticalDistance: 300,
        minNumber: 46,
        maxNumber: 56,
        poleWidth: 12,
        poleHeight: 12,
        poleSprites: new Map([
            ['red', Resources.PoleRed.toSprite()],
            ['blue', Resources.PoleBlue.toSprite()]
        ]),
        poleCheckSprites: new Map([
            ['red', Resources.PoleCheckRed.toSprite()],
            ['blue', Resources.PoleCheckBlue.toSprite()]
        ]),
        poleShadow: Resources.PoleShadow.toSprite()
    };
    static DH_GATES_CONFIG = {
        trackStyle: TrackStyles.DH,
        maxWidth: 150,
        minWidth: 120,
        maxHorizontalDistance: 180,
        minVerticalDistance: 252,
        maxVerticalDistance: 318,
        minNumber: 48,
        maxNumber: 58,
        poleWidth: 12,
        poleHeight: 12,
        poleSprites: new Map([['red', Resources.PoleRed.toSprite()]]),
        poleCheckSprites: new Map([['red', Resources.PoleCheckRed.toSprite()]]),
        poleShadow: Resources.PoleShadow.toSprite()
    };

    // POLES
    static POLE_DETECTOR_MARGIN = 18;
    static FINAL_POLE_WIDTH = 40;
    static FINAL_POLE_HEIGHT = 70;

    // SPECTATORS
    static SPECTATOR_HEIGHT = 18;
    static SPECTATOR_WIDTH = 18;
    static SPECTATOR_SPRITES = [
        Resources.Spectator1.toSprite(),
        Resources.Spectator2.toSprite(),
        Resources.Spectator3.toSprite(),
        Resources.Spectator4.toSprite()
    ];
    static SPECTATOR_SHADOW = Resources.SpectatorShadow.toSprite();
    static SPECTATORS_MAX_DENSITY = 20;
    static SPECTATORS_MAX_SOUND_DISTANCE = 600;
    static SPECTATORS_SOUND_INTENSITY = 0.15;
    static SPECTATORS_SOUNDS = [
        Resources.SpectatorsSound,
        Resources.Spectators2Sound,
        Resources.Spectators3Sound,
        Resources.Spectators4Sound
    ];
    static SPECTATORS_INTENSE_SOUND_PROBABILITY = 0.15;
    static SPECTATORS_INTENSE_SOUND_INTENSITY = 0.2;
    static SPECTATORS_INTENSE_SOUNDS = [Resources.SpectatorsIntenseSound];
    static SPECTATORS_BELLS_SOUND_PROBABILITY = 0.4;
    static SPECTATORS_BELLS_SOUND_INTENSITY = 0.2;
    static SPECTATORS_BELLS_SOUNDS = [Resources.SpectatorsBellsSound, Resources.SpectatorsBells2Sound];
    static SPECTATOR_HIT_SOUND_INTENSITY = 0.3;
    static SPECTATOR_HIT_SOUNDS = [
        Resources.SpectatorHitSound,
        Resources.SpectatorHit2Sound,
        Resources.SpectatorHit3Sound
    ];

    static DECORATIONS_AMOUNT_MAX_AMOUNT = 100;
    static DECORATIONS_SPRITES = {
        tree: Resources.Tree.toSprite()
    };

    static DECORATION_TREE_SIZE = 65;
}
