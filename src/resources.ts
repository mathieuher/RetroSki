import { ImageSource, Sound } from 'excalibur';
import skier from './images/sprites/skier.png';
import skierCarving from './images/sprites/skier_carving.png';
import skierSliding from './images/sprites/skier_sliding.png';
import skierBraking from './images/sprites/skier_braking.png';

import globalRecordGhost from './images/sprites/globalRecordGhost.png';
import globalRecordGhostCarving from './images/sprites/globalRecordGhost_carving.png';
import globalRecordGhostSliding from './images/sprites/globalRecordGhost_sliding.png';
import globalRecordGhostBraking from './images/sprites/globalRecordGhost_braking.png';

import eventRecordGhost from './images/sprites/eventRecordGhost.png';
import eventRecordGhostCarving from './images/sprites/eventRecordGhost_carving.png';
import eventRecordGhostSliding from './images/sprites/eventRecordGhost_sliding.png';
import eventRecordGhostBraking from './images/sprites/eventRecordGhost_braking.png';

import startingGate from './images/sprites/starting_gate.png';
import startingHouse from './images/sprites/starting_house.png';
import poleRed from './images/sprites/pole_red.png';
import poleBlue from './images/sprites/pole_blue.png';
import polePassedRed from './images/sprites/pole_passed_red.png';
import polePassedBlue from './images/sprites/pole_passed_blue.png';
import finalGate from './images/sprites/final_gate.png';

import winterSound from './sounds/winter.mp3';
import startRaceSound from './sounds/start_race.mp3';
import finishRaceSound from './sounds/finish_race.mp3';
import gateMissedSound from './sounds/gate_missed.mp3';
import poleHittingSound from './sounds/pole_hitting.mp3';
import turningSound from './sounds/turning.mp3';

const Resources = {
    Skier: new ImageSource(skier),
    SkierCarving: new ImageSource(skierCarving),
    SkierSliding: new ImageSource(skierSliding),
    SkierBraking: new ImageSource(skierBraking),

    GlobalGhostSkier: new ImageSource(globalRecordGhost),
    GlobalGhostSkierCarving: new ImageSource(globalRecordGhostCarving),
    GlobalGhostSkierSliding: new ImageSource(globalRecordGhostSliding),
    GlobalGhostSkierBraking: new ImageSource(globalRecordGhostBraking),

    EventRecordGhost: new ImageSource(eventRecordGhost),
    EventRecordGhostCarving: new ImageSource(eventRecordGhostCarving),
    EventRecordGhostSliding: new ImageSource(eventRecordGhostSliding),
    EventRecordGhostBraking: new ImageSource(eventRecordGhostBraking),

    StartingGate: new ImageSource(startingGate),
    StartingHouse: new ImageSource(startingHouse),
    PoleRed: new ImageSource(poleRed),
    PoleBlue: new ImageSource(poleBlue),
    PolePassedRed: new ImageSource(polePassedRed),
    PolePassedBlue: new ImageSource(polePassedBlue),
    FinalGate: new ImageSource(finalGate),

    WinterSound: new Sound(winterSound),
    FinishRaceSound: new Sound(finishRaceSound),
    StartRaceSound: new Sound(startRaceSound),
    GateMissedSound: new Sound(gateMissedSound),
    PoleHittingSound: new Sound(poleHittingSound),
    TurningSound: new Sound(turningSound),
};

export { Resources };
