let w;
const TILE_SIZE = 20;
// initializes the world
function setup() {
    let nrow = 15;
    let ncol = 15;
    w = new MazeWorld(nrow, ncol);
    createCanvas(ncol * TILE_SIZE, nrow * TILE_SIZE);
}

// the game loop
function draw() {
    background(135, 135, 135);
    noFill();
    noStroke()
    w.makeScene();
    w.onTick();
}

// handles key events
function keyPressed() {
    w.onKeyEvent(keyCode);
}
