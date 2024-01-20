import { ImageSource, Sound } from "excalibur";
import skier from "./images/sprites/skier.png";
import skierCarving from "./images/sprites/skier_carving.png";
import skierSliding from "./images/sprites/skier_sliding.png";
import skierBraking from "./images/sprites/skier_braking.png";
import skierJumping from "./images/sprites/skier_jumping.png";
import poleRed from "./images/sprites/pole_red.png";
import poleBlue from "./images/sprites/pole_blue.png";
import poleTouchedRed from "./images/sprites/pole_touched_red.png";
import poleTouchedBlue from "./images/sprites/pole_touched_blue.png";
import polePassedRed from "./images/sprites/pole_passed_red.png";
import polePassedBlue from "./images/sprites/pole_passed_blue.png";
import finalPole from "./images/sprites/final_pole.png";
import winterSound from "./sounds/winter.mp3";
import startRaceSound from "./sounds/start_race.mp3";
import finishRaceSound from "./sounds/finish_race.mp3";
import gateMissedSound from "./sounds/gate_missed.mp3";
import poleHittingSound from "./sounds/pole_hitting.mp3";

const Resources = {
    Skier: new ImageSource(skier),
    SkierCarving: new ImageSource(skierCarving),
    SkierSliding: new ImageSource(skierSliding),
    SkierBraking: new ImageSource(skierBraking),
    SkierJumping: new ImageSource(skierJumping),
    PoleRed: new ImageSource(poleRed),
    PoleBlue: new ImageSource(poleBlue),
    PoleTouchedRed: new ImageSource(poleTouchedRed),
    PoleTouchedBlue: new ImageSource(poleTouchedBlue),
    PolePassedRed: new ImageSource(polePassedRed),
    PolePassedBlue: new ImageSource(polePassedBlue),
    FinalPole: new ImageSource(finalPole),

    WinterSound: new Sound(winterSound),
    FinishRaceSound: new Sound(finishRaceSound),
    StartRaceSound: new Sound(startRaceSound),
    GateMissedSound: new Sound(gateMissedSound),
    PoleHittingSound: new Sound(poleHittingSound)

};

export { Resources };