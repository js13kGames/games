const GameState = {
    IDLE: 1,
    PLAYING: 2,
    LEVELWON: 3,
    GAMEOVER: 4
}

const TrebuchetState = {
    LOAD_OR_MOVE: 1,
    FIRE: 2,
    DONE: 3
}

const AnimationState = {
    HIGHLIGHT_ATTACKER: 1,
    HIGHLIGHT_ATTACK: 2,
    HIGHLIGHT_ATTACKEE: 3,
    EARTHQUAKE: 4
}

const AttackType = {
    TREBUCHET_ATTACKS_VILLAGE: 0,
    TREBUCHET_MISSES_VILLAGE: 1,
    VILLAGE_ATTACKS_TREBUCHET: 2,
    VILLAGE_MISSES_TREBUCHET: 3
}

const BoardWidth = 1100;
const BoardHeight = 700;
const BaseRadius = 50;

const HighScoreString = "johan.ahlgren.turrets_and_trebuchets";