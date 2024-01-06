import { ImageSource } from "excalibur";
import sword from "./images/sword.png";
import skier from "./images/skier.png";
import skierCarving from "./images/skier_carving.png";
import skierSliding from "./images/skier_sliding.png";
import skierBraking from "./images/skier_braking.png";
import skierJumping from "./images/skier_jumping.png";

let Resources = {
    Sword: new ImageSource(sword),
    Skier: new ImageSource(skier),
    SkierCarving: new ImageSource(skierCarving),
    SkierSliding: new ImageSource(skierSliding),
    SkierBraking: new ImageSource(skierBraking),
    SkierJumping: new ImageSource(skierJumping)
};

export { Resources };