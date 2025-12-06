import { Axes, Buttons, Color, Keys } from 'excalibur';
import { Resources } from './resources';
import { TrackStyles } from './models/track-styles.enum';
import type { GatesConfig } from './models/gates-config';
import type { SlopeSectionConfig } from './models/slope-section-config';
import type { SlopeConfig } from './models/slope-config';

export class Config {
    // DISPLAY
    static DISPLAY_WIDTH = 800;
    static DISPLAY_HEIGHT = 800;
    static CAMERA_ZOOM = 1.05;
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

    // ACADEMY
    static AFTER_STEP_SMALL_WAITING_TIME = 2_500;
    static AFTER_STEP_LONG_WAITING_TIME = 4_000;

    // RACE
    static MISSED_GATE_PENALTY_TIME = 3000;
    static SECTORS_PER_RACE = 2;
    static SECTOR_DISPLAY_TIME = 4500;

    // FORMAT
    static FORMAT_TIMING = 'mm:ss:SS';

    // TRACKS
    static CURRENT_BUILDER_VERSION = 5;
    static DEFAULT_TRACKS = ['soelden', 'davos', 'wengen', 'adelboden', 'zermatt'];

    // CONTROLS
    static KEYBOARD_CONTROL_CARVE_RIGHT = Keys.ArrowRight;
    static KEYBOARD_CONTROL_CARVE_LEFT = Keys.ArrowLeft;
    static KEYBOARD_CONTROL_BRAKE = Keys.Space;
    static KEYBOARD_CONTROL_BRAKE_ALT = Keys.ArrowDown;
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

    // PHYSICS
    // DYNAMIC
    static MAX_SPEED = 150;
    static VELOCITY_MULTIPLIER_RATE = 7 * 0.6;
    static LATERAL_VELOCITY_ROTATION_RATE = 1.08;
    // ROTATION
    static MAX_RIGHT_ROTATION_ANGLE = Math.PI / 2;
    static MAX_LEFT_ROTATION_ANGLE = (3 * Math.PI) / 2;
    static ROTATION_RECENTER_RATE = 0.2;
    // SKIER
    static ACCELERATION_RATE = 1.19;
    static BRAKING_RATE = 1;
    static CARVING_ADHERENCE_RATE = 0.9;
    static CARVING_BRAKING_RATE = 0.08;
    static SLIDING_ADHERENCE_RATE = 0.75;
    static SLIDING_BRAKING_RATE = 0.92;
    // SKIER SPECIFIC STYLE DYNAMIC
    static SL_SKIER_CONFIG = {
        windFrictionRate: 0.000052,
        carvingRotationRate: 3.1,
        carvingOptimalSpeed: 50,
        slidingRotationRate: 3.1,
        slidingOptimalSpeed: 35
    };
    static GS_SKIER_CONFIG = {
        windFrictionRate: 0.000048,
        carvingRotationRate: 3,
        carvingOptimalSpeed: 60,
        slidingRotationRate: 3,
        slidingOptimalSpeed: 45
    };
    static SG_SKIER_CONFIG = {
        windFrictionRate: 0.000032,
        carvingRotationRate: 2.5,
        carvingOptimalSpeed: 70,
        slidingRotationRate: 2.5,
        slidingOptimalSpeed: 50
    };
    static DH_SKIER_CONFIG = {
        windFrictionRate: 0.000026,
        carvingRotationRate: 2.25,
        carvingOptimalSpeed: 75,
        slidingRotationRate: 2.25,
        slidingOptimalSpeed: 60
    };
    // ANIMATION
    static ANIMATION_FRAME_DURATION = 2;
    static ANIMATION_FRAME_AMOUNT = 6;
    static MAX_ANIMATION_INTENSITY = this.ANIMATION_FRAME_DURATION * this.ANIMATION_FRAME_AMOUNT;

    // SLOPE
    static SLOPE_CONFIG: SlopeConfig = {
        defaultIncline: 18,
        minIncline: 13,
        maxIncline: 35,
        minSectionLength: 600,
        maxSections: 4,
        startFinishLength: 1200
    };
    static SLOPE_LEGACY_CONFIG: SlopeConfig = {
        defaultIncline: Config.SLOPE_CONFIG.defaultIncline,
        minIncline: Config.SLOPE_CONFIG.defaultIncline,
        maxIncline: Config.SLOPE_CONFIG.defaultIncline,
        minSectionLength: 0,
        maxSections: 1,
        startFinishLength: Config.SLOPE_CONFIG.startFinishLength
    };

    // SPECIFIC SLOPE SECTION
    static SLOPE_SECTION_WHITE_CONFIG: SlopeSectionConfig = {
        texture: Resources.SnowTexture,
        labelColor: Color.fromRGB(128, 128, 128, 0.4),
        dividerColor: Color.Transparent,
        particlesColor: Color.fromRGB(128, 128, 128, 0.1)
    };
    static SLOPE_SECTION_GREEN_CONFIG: SlopeSectionConfig = {
        texture: Resources.SnowTextureGreen,
        labelColor: Color.fromRGB(0, 255, 0, 0.4),
        dividerColor: Color.fromRGB(0, 255, 0, 0.1),
        particlesColor: Color.fromRGB(0, 255, 0, 0.1)
    };
    static SLOPE_SECTION_BLUE_CONFIG: SlopeSectionConfig = {
        texture: Resources.SnowTextureBlue,
        labelColor: Color.fromRGB(0, 0, 255, 0.4),
        dividerColor: Color.fromRGB(0, 0, 255, 0.1),
        particlesColor: Color.fromRGB(0, 0, 255, 0.1)
    };
    static SLOPE_SECTION_RED_CONFIG: SlopeSectionConfig = {
        texture: Resources.SnowTextureRed,
        labelColor: Color.fromRGB(255, 0, 0, 0.4),
        dividerColor: Color.fromRGB(255, 0, 0, 0.1),
        particlesColor: Color.fromRGB(255, 0, 0, 0.1)
    };
    static SLOPE_SECTION_BLACK_CONFIG: SlopeSectionConfig = {
        texture: Resources.SnowTextureBlack,
        labelColor: Color.fromRGB(0, 0, 0, 0.4),
        dividerColor: Color.fromRGB(0, 0, 0, 0.4),
        particlesColor: Color.fromRGB(0, 0, 0, 0.1)
    };

    // GATES
    static GATE_DEFAULT_HEIGHT = 3;
    static GATE_MAX_LEFT_POSITION = Config.DISPLAY_MAX_LEFT_POSITION;
    static GATE_MAX_RIGHT_POSITION = Config.DISPLAY_MAX_RIGHT_POSITION;
    static FINAL_GATE_WIDTH = Config.DISPLAY_WIDTH - 2 * Config.DISPLAY_MIN_MARGIN;
    static FINAL_GATE_POSITION = Config.DISPLAY_MAX_LEFT_POSITION;
    static GATE_FOLLOWING_DISTANCE_RATIO = 0.8;
    static GATE_VERTICAL_HEIGHT = 100;
    static GATE_VERTICAL_BETWEEN_MARGIN = 10;
    // SPECIFIC TRACK STYLE CONFIG
    static SL_GATES_CONFIG: GatesConfig = {
        trackStyle: TrackStyles.SL,
        maxWidth: 120,
        minWidth: 80,
        maxHorizontalDistance: 105,
        minVerticalDistance: 120,
        maxVerticalDistance: 150,
        minNumber: 54,
        maxNumber: 66,
        poleWidth: 3,
        poleHeight: 3,
        poleSprites: new Map([
            ['red', Resources.PoleSlRed.toSprite()],
            ['blue', Resources.PoleSlBlue.toSprite()]
        ]),
        poleCheckSprites: new Map([
            ['red', Resources.PoleCheckRed.toSprite()],
            ['blue', Resources.PoleCheckBlue.toSprite()]
        ]),
        poleShadow: Resources.PoleSlShadow.toSprite(),
        followingGateAmount: 3,
        doubleGateAmount: 2,
        tripleGateAmount: 2
    };
    static GS_GATES_CONFIG: GatesConfig = {
        trackStyle: TrackStyles.GS,
        maxWidth: 120,
        minWidth: 100,
        maxHorizontalDistance: 115,
        minVerticalDistance: 140,
        maxVerticalDistance: 200,
        minNumber: 50,
        maxNumber: 65,
        poleWidth: 12,
        poleHeight: 3,
        poleSprites: new Map([
            ['red', Resources.PoleRed.toSprite()],
            ['blue', Resources.PoleBlue.toSprite()]
        ]),
        poleCheckSprites: new Map([
            ['red', Resources.PoleCheckRed.toSprite()],
            ['blue', Resources.PoleCheckBlue.toSprite()]
        ]),
        poleShadow: Resources.PoleShadow.toSprite(),
        followingGateAmount: 3,
        doubleGateAmount: 0,
        tripleGateAmount: 0
    };
    static SG_GATES_CONFIG: GatesConfig = {
        trackStyle: TrackStyles.SG,
        maxWidth: 150,
        minWidth: 120,
        maxHorizontalDistance: 115,
        minVerticalDistance: 220,
        maxVerticalDistance: 300,
        minNumber: 46,
        maxNumber: 56,
        poleWidth: 12,
        poleHeight: 3,
        poleSprites: new Map([
            ['red', Resources.PoleRed.toSprite()],
            ['blue', Resources.PoleBlue.toSprite()]
        ]),
        poleCheckSprites: new Map([
            ['red', Resources.PoleCheckRed.toSprite()],
            ['blue', Resources.PoleCheckBlue.toSprite()]
        ]),
        poleShadow: Resources.PoleShadow.toSprite(),
        followingGateAmount: 3,
        doubleGateAmount: 0,
        tripleGateAmount: 0
    };
    static DH_GATES_CONFIG = {
        trackStyle: TrackStyles.DH,
        maxWidth: 160,
        minWidth: 130,
        maxHorizontalDistance: 90,
        minVerticalDistance: 280,
        maxVerticalDistance: 360,
        minNumber: 48,
        maxNumber: 58,
        poleWidth: 12,
        poleHeight: 3,
        poleSprites: new Map([['red', Resources.PoleRed.toSprite()]]),
        poleCheckSprites: new Map([['red', Resources.PoleCheckRed.toSprite()]]),
        poleShadow: Resources.PoleShadow.toSprite(),
        followingGateAmount: 3,
        doubleGateAmount: 0,
        tripleGateAmount: 0
    };

    // POLES
    static POLE_DETECTOR_MARGIN = 10;
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
    static SPECTATORS_INTENSE_SOUND_PROBABILITY = 0.05;
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

    // DECORATION
    static DECORATIONS_AMOUNT_MAX_AMOUNT = 100;
    static DECORATIONS_SPRITES = {
        tree: Resources.Tree.toSprite()
    };
    static DECORATION_TREE_SIZE = 65;

    // THROTTLING PERFORMANCE (ratio framerate divider)
    static THROTTLING_SPECTATOR_GROUP = 10;
    static THROTTLING_SPECTATOR = 3;
    static THROTTLING_STARTING_HOUSE = 60;
    static THROTTLING_SKIER_SOUND = 6;
    static THROTTLING_SKIER_PARTICLES = 2;
    static THROTTLING_GHOST = 2;
}
