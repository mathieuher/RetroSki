import { Axes, Buttons, Keys } from "excalibur";

export class Config {
    // DISPLAY
    static DISPLAY_WIDTH = 800;
    static DISPLAY_HEIGHT = 800;
    static VISIBLE_ON_SCREEN_MARGIN_FACTOR = 1.5;
    static CAMERA_ZOOM = 0.6;
    static DISPLAY_MIN_MARGIN = 25;
    static DISPLAY_MAX_RIGHT_POSITION = (Config.DISPLAY_WIDTH / 2) - this.DISPLAY_MIN_MARGIN;
    static DISPLAY_MAX_LEFT_POSITION = -Config.DISPLAY_MAX_RIGHT_POSITION;
    static FRONT_GHOST_DISTANCE = - this.DISPLAY_HEIGHT / 2;

    // SOUND
    static BRAKING_SOUND_VOLUME = 0.05;
    static CARVING_SOUND_VOLUME = 0.05;

    // RACE
    static MISSED_GATE_PENALTY_TIME = 3000;

    // FORMAT
    static FORMAT_TIMING = 'mm:ss:SS';

    // TRACKS
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

    // DYNAMIC
    static MAX_SPEED = 150;
    static VELOCITY_MULTIPLIER_RATE = 7;
    static LATERAL_VELOCITY_ROTATION_RATE = 1.15;
    // ROTATION
    static MAX_RIGHT_ROTATION_ANGLE = Math.PI / 2;
    static MAX_LEFT_ROTATION_ANGLE = 3 * Math.PI / 2;
    static ROTATION_RECENTER_RATE = 0.2;

    // SLOPE
    static INITIAL_SLOPE = 0.1;

    // SKIER
    static ACCELERATION_RATE = 3;
    static BRAKING_RATE = 1;
    static CARVING_ADHERENCE_RATE = 0.9;
    static CARVING_BRAKING_RATE = 0.01;
    static SLIDING_ADHERENCE_RATE = 0.6;
    static SLIDING_BRAKING_RATE = 0.9;
    // SKIER SPECIFIC STYLE DYNAMIC
    static SL_SKIER_CONFIG = {
        windFrictionRate: 0.0025,
        carvingRotationRate: 3.2,
        carvingOptimalSpeed: 50,
        slidingRotationRate: 4.2,
        slidingOptimalSpeed: 35
    }
    static GS_SKIER_CONFIG = {
        windFrictionRate: 0.0022,
        carvingRotationRate: 3.1,
        carvingOptimalSpeed: 60,
        slidingRotationRate: 4.1,
        slidingOptimalSpeed: 45
    }
    static SG_SKIER_CONFIG = {
        windFrictionRate: 0.002,
        carvingRotationRate: 2.6,
        carvingOptimalSpeed: 70,
        slidingRotationRate: 3.2,
        slidingOptimalSpeed: 50
    }
    static DH_SKIER_CONFIG = {
        windFrictionRate: 0.0018,
        carvingRotationRate: 2.2,
        carvingOptimalSpeed: 75,
        slidingRotationRate: 3.1,
        slidingOptimalSpeed: 60
    }

    // GATES
    static GATE_MAX_LEFT_POSITION = Config.DISPLAY_MAX_LEFT_POSITION;
    static GATE_MAX_RIGHT_POSITION = Config.DISPLAY_MAX_RIGHT_POSITION;
    static FINAL_GATE_WIDTH = Config.DISPLAY_WIDTH - (2 * Config.DISPLAY_MIN_MARGIN);
    static FINAL_GATE_POSITION = Config.DISPLAY_MAX_LEFT_POSITION;
    static GATE_OTHER_SIDE_PROBABILITY = 0.95;
    // SPECIFIC TRACK STYLE CONFIG
    static SL_GATES_CONFIG = {
        maxWidth: 190,
        minWidth: 150,
        maxHorizontalDistance: 320,
        minVerticalDistance: 170,
        maxVerticalDistance: 270,
        minNumber: 41,
        maxNumber: 51
    }
    static GS_GATES_CONFIG = {
        maxWidth: 200,
        minWidth: 160,
        maxHorizontalDistance: 320,
        minVerticalDistance: 200,
        maxVerticalDistance: 350,
        minNumber: 44,
        maxNumber: 54
    }
    static SG_GATES_CONFIG = {
        maxWidth: 240,
        minWidth: 190,
        maxHorizontalDistance: 350,
        minVerticalDistance: 320,
        maxVerticalDistance: 500,
        minNumber: 46,
        maxNumber: 56
    }
    static DH_GATES_CONFIG = {
        maxWidth: 250,
        minWidth: 200,
        maxHorizontalDistance: 300,
        minVerticalDistance: 420,
        maxVerticalDistance: 530,
        minNumber: 48,
        maxNumber: 58
    }

    // POLES
    static POLE_WIDTH = 20;
    static POLE_HEIGHT = 40;
    static POLE_DETECTOR_MARGIN = 22;
    static FINAL_POLE_WIDTH = 30;
    static FINAL_POLE_HEIGHT = 80;


}