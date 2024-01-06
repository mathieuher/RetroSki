import { ImageSource } from "excalibur";
import skier from "./images/skier.png";
import skierCarving from "./images/skier_carving.png";
import skierSliding from "./images/skier_sliding.png";
import skierBraking from "./images/skier_braking.png";
import skierJumping from "./images/skier_jumping.png";
import poleRed from "./images/pole_red.png";
import poleBlue from "./images/pole_blue.png";
import poleTouchedRed from "./images/pole_touched_red.png";
import poleTouchedBlue from "./images/pole_touched_blue.png";
import polePassedRed from "./images/pole_passed_red.png";
import polePassedBlue from "./images/pole_passed_blue.png";

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
    PolePassedBlue: new ImageSource(polePassedBlue)
};

export { Resources };