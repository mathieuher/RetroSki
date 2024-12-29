import { ImageSource, Sound } from 'excalibur';

const Resources = {
    Skier: new ImageSource('./assets/images/sprites/skier.png'),
    SkierCarving: new ImageSource('./assets/images/sprites/skier_carving.png'),
    SkierSliding: new ImageSource('./assets/images/sprites/skier_sliding.png'),
    SkierBraking: new ImageSource('./assets/images/sprites/skier_braking.png'),

    GlobalGhostSkier: new ImageSource('./assets/images/sprites/globalRecordGhost.png'),
    GlobalGhostSkierCarving: new ImageSource('./assets/images/sprites/globalRecordGhost_carving.png'),
    GlobalGhostSkierSliding: new ImageSource('./assets/images/sprites/globalRecordGhost_sliding.png'),
    GlobalGhostSkierBraking: new ImageSource('./assets/images/sprites/globalRecordGhost_braking.png'),

    EventRecordGhost: new ImageSource('./assets/images/sprites/eventRecordGhost.png'),
    EventRecordGhostCarving: new ImageSource('./assets/images/sprites/eventRecordGhost_carving.png'),
    EventRecordGhostSliding: new ImageSource('./assets/images/sprites/eventRecordGhost_sliding.png'),
    EventRecordGhostBraking: new ImageSource('./assets/images/sprites/eventRecordGhost_braking.png'),

    StartingGate: new ImageSource('./assets/images/sprites/starting_gate.png'),
    StartingHouse: new ImageSource('./assets/images/sprites/starting_house.png'),
    PoleRed: new ImageSource('./assets/images/sprites/pole_red.png'),
    PoleBlue: new ImageSource('./assets/images/sprites/pole_blue.png'),
    PoleSlRed: new ImageSource('./assets/images/sprites/pole_sl_red.png'),
    PoleSlBlue: new ImageSource('./assets/images/sprites/pole_sl_blue.png'),
    PoleCheckRed: new ImageSource('./assets/images/sprites/pole_check_red.png'),
    PoleCheckBlue: new ImageSource('./assets/images/sprites/pole_check_blue.png'),
    FinalGate: new ImageSource('./assets/images/sprites/final_gate.png'),
    PoleShadow: new ImageSource('./assets/images/sprites/pole_shadow.png'),
    PoleSlShadow: new ImageSource('./assets/images/sprites/pole_sl_shadow.png'),

    Spectator1: new ImageSource('./assets/images/sprites/spectator_1.png'),
    Spectator2: new ImageSource('./assets/images/sprites/spectator_2.png'),
    Spectator3: new ImageSource('./assets/images/sprites/spectator_3.png'),
    Spectator4: new ImageSource('./assets/images/sprites/spectator_4.png'),
    SpectatorShadow: new ImageSource('./assets/images/sprites/spectator_shadow.png'),

    Tree: new ImageSource('./assets/images/sprites/tree.png'),
    TreeShadow: new ImageSource('./assets/images/sprites/tree_shadow.png'),

    WinterSound: new Sound('./assets/sounds/winter.mp3'),
    FinishRaceSound: new Sound('./assets/sounds/finish_race.mp3'),
    StartRaceSound: new Sound('./assets/sounds/start_race.mp3'),
    GateMissedSound: new Sound('./assets/sounds/gate_missed.mp3'),
    PoleHittingSound: new Sound('./assets/sounds/pole_hitting.mp3'),
    TurningSound: new Sound('./assets/sounds/turning.mp3'),
    SpectatorsSound: new Sound('./assets/sounds/spectators.mp3'),
    Spectators2Sound: new Sound('./assets/sounds/spectators2.mp3'),
    Spectators3Sound: new Sound('./assets/sounds/spectators3.mp3'),
    Spectators4Sound: new Sound('./assets/sounds/spectators4.mp3'),
    SpectatorsIntenseSound: new Sound('./assets/sounds/spectators_intense.mp3'),
    SpectatorHitSound: new Sound('./assets/sounds/spectator_hit.mp3'),
    SpectatorHit2Sound: new Sound('./assets/sounds/spectator_hit2.mp3'),
    SpectatorHit3Sound: new Sound('./assets/sounds/spectator_hit3.mp3'),
    SpectatorsBellsSound: new Sound('./assets/sounds/spectators_bells.mp3'),
    SpectatorsBells2Sound: new Sound('./assets/sounds/spectators_bells2.mp3')
};

export { Resources };
