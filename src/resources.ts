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
import poleSlRed from './images/sprites/pole_sl_red.png';
import poleSlBlue from './images/sprites/pole_sl_blue.png';
import poleCheckRed from './images/sprites/pole_check_red.png';
import poleCheckBlue from './images/sprites/pole_check_blue.png';
import finalGate from './images/sprites/final_gate.png';

import spectator1 from './images/sprites/spectator_1.png';
import spectator2 from './images/sprites/spectator_2.png';
import spectator3 from './images/sprites/spectator_3.png';
import spectator4 from './images/sprites/spectator_4.png';

import winterSound from './sounds/winter.mp3';
import startRaceSound from './sounds/start_race.mp3';
import finishRaceSound from './sounds/finish_race.mp3';
import gateMissedSound from './sounds/gate_missed.mp3';
import poleHittingSound from './sounds/pole_hitting.mp3';
import turningSound from './sounds/turning.mp3';
import spectators from './sounds/spectators.wav';
import spectators2Sound from './sounds/spectators_2.mp3';
import spectatorsIntenseSound from './sounds/spectators_intense.mp3';
import spectatorHitSound from './sounds/spectator_hit.mp3';

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
    PoleSlRed: new ImageSource(poleSlRed),
    PoleSlBlue: new ImageSource(poleSlBlue),
    PoleCheckRed: new ImageSource(poleCheckRed),
    PoleCheckBlue: new ImageSource(poleCheckBlue),
    FinalGate: new ImageSource(finalGate),

    Spectator1: new ImageSource(spectator1),
    Spectator2: new ImageSource(spectator2),
    Spectator3: new ImageSource(spectator3),
    Spectator4: new ImageSource(spectator4),

    WinterSound: new Sound(winterSound),
    FinishRaceSound: new Sound(finishRaceSound),
    StartRaceSound: new Sound(startRaceSound),
    GateMissedSound: new Sound(gateMissedSound),
    PoleHittingSound: new Sound(poleHittingSound),
    TurningSound: new Sound(turningSound),
    SpectatorsSound: new Sound(spectators),
    Spectators2Sound: new Sound(spectators2Sound),
    SpectatorsIntenseSound: new Sound(spectatorsIntenseSound),
    SpectatorHitSound: new Sound(spectatorHitSound)
};

export { Resources };
